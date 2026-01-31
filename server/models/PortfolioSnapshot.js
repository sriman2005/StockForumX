import mongoose from 'mongoose';

const portfolioSnapshotSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalValue: {
        type: Number,
        required: true
    },
    holdingsValue: {
        type: Number,
        required: true
    },
    cashBalance: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    }
}, {
    timestamps: true
});

// Index for efficient historical queries
portfolioSnapshotSchema.index({ userId: 1, date: -1 });

const PortfolioSnapshot = mongoose.model('PortfolioSnapshot', portfolioSnapshotSchema);

export default PortfolioSnapshot;
