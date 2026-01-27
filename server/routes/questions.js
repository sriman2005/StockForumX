import express from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/auth.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import Stock from '../models/Stock.js';
import { findSimilarQuestions } from '../utils/similarity.js';

const router = express.Router();

// @route   GET /api/questions
// @desc    Get questions with filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { userId, stockId, stockSymbol, tag, sort = 'recent', search } = req.query;
        const query = {};

        console.log('Questions API called with:', { userId, stockId, stockSymbol, tag, sort, search }); // Debug

        // Filter by user
        if (userId) {
            query.userId = userId;
        }

        // Filter by stock
        if (stockId) {
            query.stockId = stockId;
        } else if (stockSymbol) {
            const stock = await Stock.findOne({ symbol: stockSymbol.toUpperCase() });
            if (stock) query.stockId = stock._id;
        }

        // Filter by tag
        if (tag) {
            query.tags = tag;
        }

        // Text search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        console.log('MongoDB Query:', JSON.stringify(query)); // Debug

        // Sorting
        let sortOption = { createdAt: -1 }; // Default: recent
        if (sort === 'popular') sortOption = { views: -1, upvotes: -1 };
        if (sort === 'unanswered') query.answerCount = 0;

        const questions = await Question.find(query)
            .populate('userId', 'username reputation')
            .populate('stockId', 'symbol name')
            .sort(sortOption)
            .limit(50);

        console.log('Questions found:', questions.length); // Debug

        res.json(questions);
    } catch (error) {
        console.error('Questions API error:', error);
        // Fallback removed
        res.status(500).json({ message: 'Error fetching questions' });
    }
});

// @route   POST /api/questions
// @desc    Create a new question
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { stockId, title, content, tags } = req.body;

        // Check for similar questions
        const combinedText = `${title} ${content}`;
        const similarQuestions = await findSimilarQuestions(Question, combinedText, stockId, 0.8);

        if (similarQuestions.length > 0) {
            return res.status(400).json({
                message: 'Similar question already exists',
                similarQuestions: similarQuestions.slice(0, 3)
            });
        }

        const question = await Question.create({
            stockId,
            userId: req.user._id,
            title,
            content,
            tags
        });

        const populatedQuestion = await Question.findById(question._id)
            .populate('userId', 'username reputation')
            .populate('stockId', 'symbol name');

        res.status(201).json(populatedQuestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/questions/:id
// @desc    Get question by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const question = await Question.findById(req.params.id)
            .populate('userId', 'username reputation')
            .populate('stockId', 'symbol name');

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Increment views
        question.views += 1;
        await question.save();

        // Get answers
        const answers = await Answer.find({ questionId: question._id })
            .populate('userId', 'username reputation')
            .sort({ isAccepted: -1, upvotes: -1, createdAt: -1 });

        res.json({ question, answers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/questions/:id/answers
// @desc    Post an answer to a question
// @access  Private
router.post('/:id/answers', protect, async (req, res) => {
    try {
        const { content } = req.body;

        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const answer = await Answer.create({
            questionId: question._id,
            userId: req.user._id,
            content
        });

        // Update question answer count
        question.answerCount += 1;
        await question.save();

        const populatedAnswer = await Answer.findById(answer._id)
            .populate('userId', 'username reputation');

        res.status(201).json(populatedAnswer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/questions/:id/upvote
// @desc    Upvote a question
// @access  Private
router.put('/:id/upvote', protect, async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Toggle upvote
        const hasUpvoted = question.upvotedBy.includes(req.user._id);

        if (hasUpvoted) {
            question.upvotedBy = question.upvotedBy.filter(id => id.toString() !== req.user._id.toString());
            question.upvotes -= 1;
        } else {
            question.upvotedBy.push(req.user._id);
            question.upvotes += 1;
        }

        await question.save();
        res.json({ upvotes: question.upvotes, hasUpvoted: !hasUpvoted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/questions/answers/:id/upvote
// @desc    Upvote an answer
// @access  Private
router.put('/answers/:id/upvote', protect, async (req, res) => {
    try {
        const answer = await Answer.findById(req.params.id);

        if (!answer) {
            return res.status(404).json({ message: 'Answer not found' });
        }

        // Toggle upvote
        const hasUpvoted = answer.upvotedBy.includes(req.user._id);

        if (hasUpvoted) {
            answer.upvotedBy = answer.upvotedBy.filter(id => id.toString() !== req.user._id.toString());
            answer.upvotes -= 1;
        } else {
            answer.upvotedBy.push(req.user._id);
            answer.upvotes += 1;
        }

        await answer.save();
        res.json({ upvotes: answer.upvotes, hasUpvoted: !hasUpvoted });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
