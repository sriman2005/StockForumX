import cron from 'node-cron';
import Stock from '../models/Stock.js';

// Simulate stock price updates every 5 minutes (for demo purposes)
export const startStockPriceUpdater = () => {
    cron.schedule('*/5 * * * *', async () => {
        console.log('Updating stock prices...');

        try {
            const stocks = await Stock.find();

            for (const stock of stocks) {
                // Simulate price change (-2% to +2%)
                const changePercent = (Math.random() * 4 - 2) / 100;
                const priceChange = stock.currentPrice * changePercent;

                stock.previousClose = stock.currentPrice;
                stock.currentPrice = parseFloat((stock.currentPrice + priceChange).toFixed(2));

                // Update high/low
                if (stock.currentPrice > stock.high24h) {
                    stock.high24h = stock.currentPrice;
                }
                if (stock.currentPrice < stock.low24h) {
                    stock.low24h = stock.currentPrice;
                }

                await stock.save();
            }

            console.log(`Updated ${stocks.length} stock prices`);
        } catch (error) {
            console.error('Stock price updater error:', error);
        }
    });

    console.log('Stock price updater scheduled (every 5 minutes)');
};
