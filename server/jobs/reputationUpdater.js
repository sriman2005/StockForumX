import cron from 'node-cron';
import User from '../models/User.js';
import ReputationSnapshot from '../models/ReputationSnapshot.js';

// Run daily at midnight
export const startReputationUpdater = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Creating reputation snapshots...');

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
            console.log(`Created ${snapshots.length} reputation snapshots`);
        } catch (error) {
            console.error('Reputation updater error:', error);
        }
    });

    console.log('Reputation updater scheduled (daily at midnight)');
};
