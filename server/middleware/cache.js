import cache from 'express-redis-cache';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Redis Connected Successfully'));

await redisClient.connect();

const redisCache = cache({
    client: redisClient,
    prefix: 'sf_cache',
    expire: 300 // 5 minutes default
});

export default redisCache;
export { redisClient };
