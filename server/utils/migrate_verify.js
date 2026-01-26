import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config({ path: './.env' });

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        const result = await User.updateMany(
            { isVerified: { $exists: false } },
            { $set: { isVerified: true } }
        );

        console.log(`Updated ${result.modifiedCount} users to verified status.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

migrate();
