import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import compression from 'compression';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import validateEnv from './config/validateEnv.js';
import Logger, { createServiceLogger } from './utils/logger.js';
import requestLogger from './middleware/requestLogger.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { RATE_LIMIT, SERVER_CONFIG } from './config/constants.js';

// Routes
import authRoutes from './routes/auth.js';
import stockRoutes from './routes/stocks.js';
import questionRoutes from './routes/questions.js';
import predictionRoutes from './routes/predictions.js';
import userRoutes from './routes/users.js';
import portfolioRoutes from './routes/portfolio.js';
import socialRoutes from './routes/social.js';
import alertRoutes from './routes/alerts.js';
import analyticsRoutes from './routes/analytics.js';

// Sockets
import { setupChatHandlers } from './sockets/chat.js';
import { setupUpdateHandlers } from './sockets/updates.js';

// Jobs
import { startPredictionEvaluator } from './jobs/predictionEvaluator.js';
import { startReputationUpdater } from './jobs/reputationUpdater.js';
import { startStockPriceUpdater } from './jobs/stockPriceUpdater.js';

// Load environment variables
dotenv.config();

// Validate environment variables
validateEnv();

// Connect to database
connectDB();

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Initialize Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: [process.env.CLIENT_URL || SERVER_CONFIG.DEFAULT_CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Rate limiting
const limiter = rateLimit({
    windowMs: RATE_LIMIT.WINDOW_MS,
    max: process.env.NODE_ENV === 'development' ? RATE_LIMIT.MAX_REQUESTS_DEV : RATE_LIMIT.MAX_REQUESTS_PROD,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Trust proxy - required when running behind nginx reverse proxy
app.set('trust proxy', 1);

app.use(helmet());
app.use(compression());
app.use(requestLogger);
app.use(cors({
    origin: [process.env.CLIENT_URL || SERVER_CONFIG.DEFAULT_CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Security: Sanitization
app.use(mongoSanitize()); // Prevent NoSQL Injection
app.use(xss()); // Prevent XSS

// Apply rate limiter only to API routes
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'StockForumX API is running' });
});

// Global Error Handler
app.use(errorHandler);

const socketLogger = createServiceLogger('socket');

// Socket.io connection
io.on('connection', (socket) => {
    socketLogger.debug('New client connected', { socketId: socket.id });

    setupChatHandlers(io, socket);
    setupUpdateHandlers(io, socket);
});

// Start background jobs
startPredictionEvaluator();
startReputationUpdater();
startStockPriceUpdater();

// Start server
const PORT = process.env.PORT || SERVER_CONFIG.DEFAULT_PORT;
httpServer.listen(PORT, () => {
    Logger.info(`
  ____________________________________________________
 |                                                    |
 |   StockForumX API Server                           |
 |   ----------------------------------------------   |
 |                                                    |
 |   > Status:   Online                               |
 |   > Port:     ${PORT}                                 |
 |   > URL:      http://localhost:${PORT}                |
 |   > Env:      ${process.env.NODE_ENV || 'development'}                          |
 |   > CORS:     ${process.env.CLIENT_URL || SERVER_CONFIG.DEFAULT_CLIENT_URL}     |
 |____________________________________________________|
  `);
});

export { io };
