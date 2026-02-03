import mongoose from 'mongoose';
import Logger from '../utils/logger.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        Logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        Logger.error(`MongoDB Connection Error: ${error.message}`);
        Logger.warn('Continuing without database connection...');
        // process.exit(1);
    }
};

export default connectDB;
