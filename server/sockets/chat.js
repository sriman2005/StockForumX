import ChatMessage from '../models/ChatMessage.js';
import { createServiceLogger } from '../utils/logger.js';

const logger = createServiceLogger('socket-chat');

export const setupChatHandlers = (io, socket) => {
    // Join stock room
    socket.on('join:stock', (stockId) => {
        socket.join(`stock:${stockId}`);
        logger.debug(`User joined stock room`, { socketId: socket.id, stockId });
    });

    // Leave stock room
    socket.on('leave:stock', (stockId) => {
        socket.leave(`stock:${stockId}`);
        logger.debug(`User left stock room`, { socketId: socket.id, stockId });
    });

    // Send chat message
    socket.on('chat:message', async (data) => {
        try {
            const { stockId, userId, message } = data;

            // Save message to database
            const chatMessage = await ChatMessage.create({
                stockId,
                userId,
                message
            });

            const populatedMessage = await ChatMessage.findById(chatMessage._id)
                .populate('userId', 'username reputation');

            // Broadcast to stock room
            io.to(`stock:${stockId}`).emit('chat:message', populatedMessage);
        } catch (error) {
            logger.error('Chat message error', { error: error.message, socketId: socket.id });
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    // Typing indicator
    socket.on('chat:typing', (data) => {
        const { stockId, username } = data;
        socket.to(`stock:${stockId}`).emit('chat:typing', { username });
    });

    // Disconnect
    socket.on('disconnect', () => {
        logger.debug('User disconnected', { socketId: socket.id });
    });
};
