import cron from 'node-cron';
import User from '../models/User.js';
import ReputationSnapshot from '../models/ReputationSnapshot.js';
import { createServiceLogger } from '../utils/logger.js';

const logger = createServiceLogger('reputation-updater');

// Run daily at midnight
export const startReputationUpdater = () => {
    cron.schedule('0 0 * * *', async () => {
        logger.info('Creating reputation snapshots...');

        try {
            const users = await User.find().select('_id reputation totalPredictions accuratePredictions');

            const snapshots = users.map((user, index) => ({
                userId: user._id,
                reputation: user.reputation,
                rank: index + 1,
                totalPredictions: user.totalPredictions,
                accuratePredictions: user.accuratePredictions,
                accuracy: user.totalPredictions > 0
                    ? (user.accuratePredictions / user.totalPredictions) * 100
                    : 0
            }));

            await ReputationSnapshot.insertMany(snapshots);
            logger.info(`Created reputation snapshots`, { count: snapshots.length });
        } catch (error) {
            logger.error('Reputation updater error', { error: error.message, stack: error.stack });
        }
    });

    logger.info('Reputation updater scheduled (daily at midnight)');
};
