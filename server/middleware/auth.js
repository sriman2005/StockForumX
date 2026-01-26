import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            if (mongoose.connection.readyState !== 1) {
                // Mock user for offline mode
                req.user = {
                    _id: 'mock_u1',
                    username: 'trader_joe',
                    reputation: 45,
                    isAdmin: false
                };
            } else {
                req.user = await User.findById(decoded.id).select('-password');

                if (!req.user) {
                    return res.status(401).json({ message: 'User not found' });
                }
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Generate JWT token
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};
