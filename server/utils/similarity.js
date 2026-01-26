import natural from 'natural';

const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

// Calculate cosine similarity between two questions
export const calculateSimilarity = (text1, text2) => {
    const tfidf = new TfIdf();

    tfidf.addDocument(text1.toLowerCase());
    tfidf.addDocument(text2.toLowerCase());

    // Get TF-IDF vectors
    const terms = new Set();
    tfidf.listTerms(0).forEach(item => terms.add(item.term));
    tfidf.listTerms(1).forEach(item => terms.add(item.term));

    const vector1 = [];
    const vector2 = [];

    terms.forEach(term => {
        vector1.push(tfidf.tfidf(term, 0));
        vector2.push(tfidf.tfidf(term, 1));
    });

    // Calculate cosine similarity
    return cosineSimilarity(vector1, vector2);
};

const cosineSimilarity = (vec1, vec2) => {
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

    if (mag1 === 0 || mag2 === 0) return 0;
    return dotProduct / (mag1 * mag2);
};

// Find similar questions
export const findSimilarQuestions = async (Question, newQuestionText, stockId, threshold = 0.8) => {
    const existingQuestions = await Question.find({ stockId })
        .select('title content')
        .limit(50); // Check last 50 questions

    const similarQuestions = [];

    for (const question of existingQuestions) {
        const combinedText = `${question.title} ${question.content}`;
        const similarity = calculateSimilarity(newQuestionText, combinedText);

        if (similarity >= threshold) {
            similarQuestions.push({
                question,
                similarity
            });
        }
    }

    return similarQuestions.sort((a, b) => b.similarity - a.similarity);
};

// Detect copy-paste predictions
export const detectCopyPaste = (text1, text2, threshold = 0.8) => {
    const similarity = calculateSimilarity(text1, text2);
    return similarity >= threshold;
};
