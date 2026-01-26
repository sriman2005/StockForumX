import cron from 'node-cron';
import Prediction from '../models/Prediction.js';
import Stock from '../models/Stock.js';
import User from '../models/User.js';
import { updateUserReputation } from '../utils/reputation.js';

// Run every 15 minutes
export const startPredictionEvaluator = () => {
    cron.schedule('*/15 * * * *', async () => {
        console.log('Running prediction evaluator...');

        try {
            // Find predictions that need evaluation
            const now = new Date();
            const predictions = await Prediction.find({
                isEvaluated: false,
                targetDate: { $lte: now }
            }).populate('stockId userId');

            console.log(`Found ${predictions.length} predictions to evaluate`);

            for (const prediction of predictions) {
                const stock = prediction.stockId;
                const actualPrice = stock.currentPrice;

                prediction.actualPrice = actualPrice;
                prediction.isEvaluated = true;

                // Evaluate correctness
                if (prediction.predictionType === 'price') {
                    // For price predictions, check if within 5% margin
                    const margin = prediction.targetPrice * 0.05;
                    prediction.isCorrect = Math.abs(actualPrice - prediction.targetPrice) <= margin;
                } else if (prediction.predictionType === 'direction') {
                    const priceChange = actualPrice - prediction.initialPrice;
                    if (prediction.direction === 'up') {
                        prediction.isCorrect = priceChange > 0;
                    } else {
                        prediction.isCorrect = priceChange < 0;
                    }
                }

                await prediction.save();

                // Update user stats
                const user = await User.findById(prediction.userId);
                if (user) {
                    user.totalPredictions += 1;
                    if (prediction.isCorrect) {
                        user.accuratePredictions += 1;
                    }
                    await user.save();

                    // Update reputation
                    await updateUserReputation(User, user._id);
                    console.log(`Updated reputation for user ${user.username}`);
                }
            }

            console.log('Prediction evaluation complete');
        } catch (error) {
            console.error('Prediction evaluator error:', error);
        }
    });

    console.log('Prediction evaluator scheduled (every 15 minutes)');
};
