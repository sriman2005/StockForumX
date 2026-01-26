import express from 'express';
import mongoose from 'mongoose';
import Stock from '../models/Stock.js';
import Question from '../models/Question.js';
import Prediction from '../models/Prediction.js';

const router = express.Router();

// Mock Data
// @route   GET /api/stocks
// @desc    Get all stocks
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        // Text search by symbol or name
        if (search) {
            query.$or = [
                { symbol: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }

        const stocks = await Stock.find(query).sort({ symbol: 1 });
        res.json(stocks);
    } catch (error) {
        console.error('Error fetching stocks:', error);
        // Fallback removed
        res.status(500).json({ message: 'Error fetching stocks' });
    }
});

// @route   GET /api/stocks/:symbol
// @desc    Get stock by symbol
// @access  Public
router.get('/:symbol', async (req, res) => {
    try {
        const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });

        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        // Get additional stats
        const questionCount = await Question.countDocuments({ stockId: stock._id });
        const predictionCount = await Prediction.countDocuments({ stockId: stock._id });

        res.json({
            ...stock.toObject(),
            stats: {
                questionCount,
                predictionCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/stocks/:symbol/trending
// @desc    Get trending questions for a stock
// @access  Public
router.get('/:symbol/trending', async (req, res) => {
    try {
        const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() });

        if (!stock) {
            return res.status(404).json({ message: 'Stock not found' });
        }

        // Get trending questions (most views + answers in last 24h)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const trendingQuestions = await Question.find({
            stockId: stock._id,
            createdAt: { $gte: oneDayAgo }
        })
            .populate('userId', 'username reputation')
            .sort({ views: -1, answerCount: -1 })
            .limit(10);

        res.json(trendingQuestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
