import mongoose from 'mongoose';

const reputationSnapshotSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reputation: {
        type: Number,
        required: true
    },
    rank: {
        type: Number
    },
    totalPredictions: {
        type: Number,
        default: 0
    },
    accuratePredictions: {
        type: Number,
        default: 0
    },
    accuracy: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient queries
reputationSnapshotSchema.index({ userId: 1, createdAt: -1 });
reputationSnapshotSchema.index({ createdAt: -1 });

const ReputationSnapshot = mongoose.model('ReputationSnapshot', reputationSnapshotSchema);

export default ReputationSnapshot;
