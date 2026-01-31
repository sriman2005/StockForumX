import cron from 'node-cron';
import Prediction from '../models/Prediction.js';
import Stock from '../models/Stock.js';
import User from '../models/User.js';
import { updateUserReputation } from '../utils/reputation.js';
import { io } from '../index.js';
import { createServiceLogger } from '../utils/logger.js';

const logger = createServiceLogger('prediction-evaluator');

// Run every 15 minutes
export const startPredictionEvaluator = () => {
    cron.schedule('*/15 * * * *', async () => {
        logger.info('Running prediction evaluator...');

        try {
            // Find predictions that need evaluation
            const now = new Date();
            const predictions = await Prediction.find({
                isEvaluated: false,
                targetDate: { $lte: now }
            }).populate('stockId userId');

            logger.info(`Found ${predictions.length} predictions to evaluate`, { count: predictions.length });

            for (const prediction of predictions) {
                const stock = prediction.stockId;
                const actualPrice = stock.currentPrice;

                prediction.actualPrice = actualPrice;
                prediction.isEvaluated = true;

                // Evaluate correctness
                if (prediction.predictionType === 'price') {
                    // For price predictions, check if within 5% margin
                    const diff = Math.abs(actualPrice - prediction.targetPrice);
                    const margin = prediction.targetPrice * 0.05;
                    const directMargin = prediction.targetPrice * 0.01;

                    prediction.isCorrect = diff <= margin;
                    prediction.precisionLevel = diff <= directMargin ? 'direct' : 'normal';
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
                    logger.debug(`Updated reputation for user`, { username: user.username, userId: user._id });

                    // Emit real-time notification
                    if (io) {
                        io.to(user._id.toString()).emit('prediction_result', {
                            predictionId: prediction._id,
                            isCorrect: prediction.isCorrect,
                            precisionLevel: prediction.precisionLevel || 'normal',
                            symbol: stock.symbol,
                            actualPrice,
                            targetPrice: prediction.targetPrice || null
                        });
                    }
                }
            }

            logger.info('Prediction evaluation complete');
        } catch (error) {
            logger.error('Prediction evaluator error', { error: error.message, stack: error.stack });
        }
    });

    logger.info('Prediction evaluator scheduled (every 15 minutes)');
};
