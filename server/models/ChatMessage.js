import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    stockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true,
        maxlength: 1000
    },
    reactions: [{
        type: {
            type: String,
            enum: ['like', 'love', 'fire', 'rocket', 'thinking']
        },
        count: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true
});

// Index for efficient queries
chatMessageSchema.index({ stockId: 1, createdAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
