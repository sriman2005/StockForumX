import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

// Determine log level based on environment
const getLogLevel = () => {
    if (process.env.LOG_LEVEL) {
        return process.env.LOG_LEVEL;
    }
    const env = process.env.NODE_ENV || 'development';
    return env === 'development' ? 'debug' : 'info';
};

// Colors for console output
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'cyan',
};

winston.addColors(colors);

// Development format: colorized, human-readable
const devFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf((info) => {
        const { timestamp, level, message, service, requestId, ...rest } = info;
        let log = `${timestamp} [${level}]`;

        if (service) {
            log += ` [${service}]`;
        }
        if (requestId) {
            log += ` [${requestId}]`;
        }
        log += `: ${message}`;

        // Add any extra metadata
        const extraKeys = Object.keys(rest);
        if (extraKeys.length > 0) {
            log += ` ${JSON.stringify(rest)}`;
        }

        return log;
    }),
);

// Production format: JSON for log aggregation tools
const prodFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
);

// Choose format based on environment
const getFormat = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'production' ? prodFormat : devFormat;
};

// Log directory
const logDir = path.join(__dirname, '..', 'logs');

// Create transports
const transports = [
    // Console transport
    new winston.transports.Console(),

    // Error log file
    new winston.transports.File({
        filename: path.join(logDir, 'error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),

    // Combined log file
    new winston.transports.File({
        filename: path.join(logDir, 'combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }),
];

// Create the main logger instance
const Logger = winston.createLogger({
    level: getLogLevel(),
    levels,
    format: getFormat(),
    transports,
    exitOnError: false,
});

/**
 * Create a child logger with additional context
 * Useful for adding service-specific or request-specific metadata
 * 
 * @param {Object} metadata - Additional metadata to include in all logs
 * @returns {winston.Logger} - Child logger instance
 * 
 * @example
 * const chatLogger = Logger.child({ service: 'chat' });
 * chatLogger.info('User connected', { userId: '123' });
 */
Logger.child = (metadata) => {
    return Logger.child(metadata);
};

/**
 * Create a request-scoped logger
 * Includes request ID for correlation
 * 
 * @param {string} requestId - Unique request identifier
 * @returns {Object} - Logger with request context
 */
export const createRequestLogger = (requestId) => {
    return {
        error: (message, meta = {}) => Logger.error(message, { requestId, ...meta }),
        warn: (message, meta = {}) => Logger.warn(message, { requestId, ...meta }),
        info: (message, meta = {}) => Logger.info(message, { requestId, ...meta }),
        http: (message, meta = {}) => Logger.http(message, { requestId, ...meta }),
        debug: (message, meta = {}) => Logger.debug(message, { requestId, ...meta }),
    };
};

/**
 * Create a service-scoped logger
 * Useful for background jobs, sockets, etc.
 * 
 * @param {string} serviceName - Name of the service
 * @returns {Object} - Logger with service context
 */
export const createServiceLogger = (serviceName) => {
    return {
        error: (message, meta = {}) => Logger.error(message, { service: serviceName, ...meta }),
        warn: (message, meta = {}) => Logger.warn(message, { service: serviceName, ...meta }),
        info: (message, meta = {}) => Logger.info(message, { service: serviceName, ...meta }),
        http: (message, meta = {}) => Logger.http(message, { service: serviceName, ...meta }),
        debug: (message, meta = {}) => Logger.debug(message, { service: serviceName, ...meta }),
    };
};

export default Logger;
