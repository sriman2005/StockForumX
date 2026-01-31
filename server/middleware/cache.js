import cache from 'express-redis-cache';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

let isRedisAvailable = false;
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 5) return new Error('Redis connection failed');
            return 5000; // Try every 5s
        }
    }
});

// Avoid log spamming if Redis isn't there
redisClient.on('error', (err) => {
    // Only log if we thought it was available, then mark as unavailable
    if (isRedisAvailable) {
        logger.error('Redis Client Error: Connection lost. Disabling cache.', err);
        isRedisAvailable = false;
    }
});

redisClient.on('connect', () => {
    logger.info('Redis Client Reconnected');
    isRedisAvailable = true;
});

try {
    await redisClient.connect();
    isRedisAvailable = true;
    logger.info('Redis Connected Successfully');
} catch (error) {
    logger.warn('⚠️ Redis not found. Caching will be disabled for this session.');
    isRedisAvailable = false;
}

const redisCacheInstance = cache({
    client: redisClient,
    prefix: 'sf_cache',
    expire: 300
});

// Bypass middleware if Redis is down
const redisCache = {
    route: (options) => {
        if (!isRedisAvailable) {
            return (req, res, next) => next();
        }
        return redisCacheInstance.route(options);
    }
};

export default redisCache;
export { redisClient, isRedisAvailable };
