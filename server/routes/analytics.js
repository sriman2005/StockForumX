import express from 'express';
import Holding from '../models/Holding.js';
import Stock from '../models/Stock.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler, ErrorResponse } from '../middleware/errorMiddleware.js';

const router = express.Router();

// @route   GET /api/analytics/diversification/:userId
// @desc    Get portfolio diversification by sector
// @access  Private
router.get('/diversification/:userId', protect, asyncHandler(async (req, res, next) => {
    // Only allow users to view their own analytics, or admins
    // Note: req.user._id is an objectId, req.params.userId is a string
    if (req.user._id.toString() !== req.params.userId) {
        return next(new ErrorResponse('Not authorized to view this portfolio', 401));
    }

    const holdings = await Holding.find({ userId: req.params.userId }).populate('stockId');

    if (!holdings || holdings.length === 0) {
        return res.json([]);
    }

    // Calculate total value and value per sector
    const sectorMap = {};
    let totalValue = 0;

    holdings.forEach(holding => {
        if (!holding.stockId) return; // Skip if stock is deleted

        const stock = holding.stockId;
        const value = holding.quantity * stock.currentPrice;
        const sector = stock.sector || 'Other';

        if (!sectorMap[sector]) {
            sectorMap[sector] = 0;
        }

        sectorMap[sector] += value;
        totalValue += value;
    });

    if (totalValue === 0) {
        return res.json([]);
    }

    // Convert map to array of percentages
    const diversification = Object.keys(sectorMap).map(sector => ({
        sector,
        value: sectorMap[sector],
        percentage: (sectorMap[sector] / totalValue) * 100
    }));

    // Round percentages
    diversification.forEach(item => {
        item.percentage = Math.round(item.percentage * 100) / 100;
    });

    res.json(diversification);
}));

export default router;
