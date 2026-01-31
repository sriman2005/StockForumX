import { randomUUID } from 'crypto';
import Logger from '../utils/logger.js';

/**
 * Request Logging Middleware
 * 
 * Generates unique request IDs for correlation and logs all HTTP requests
 * with method, URL, status code, and response time.
 */
export const requestLogger = (req, res, next) => {
    // Generate or use existing request ID
    const requestId = req.headers['x-request-id'] || randomUUID().slice(0, 8);

    // Attach request ID to request object for downstream usage
    req.requestId = requestId;

    // Set response header for client correlation
    res.setHeader('X-Request-ID', requestId);

    // Capture start time
    const startTime = Date.now();

    // Log incoming request
    Logger.http('Incoming request', {
        requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
    });

    // Capture response finish
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const level = res.statusCode >= 400 ? 'warn' : 'http';

        Logger[level](`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
            requestId,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            duration,
        });
    });

    // Capture response errors
    res.on('error', (error) => {
        Logger.error('Response error', {
            requestId,
            error: error.message,
            stack: error.stack,
        });
    });

    next();
};

export default requestLogger;
