export const setupUpdateHandlers = (io, socket) => {
    // Join global updates room
    socket.on('join:updates', () => {
        socket.join('global:updates');
        console.log('User joined global updates');
    });

    // Leave global updates room
    socket.on('leave:updates', () => {
        socket.leave('global:updates');
    });
};

// Helper function to broadcast updates from server-side
export const broadcastUpdate = (io, event, data) => {
    io.to('global:updates').emit(event, data);
};

// Broadcast new question
export const broadcastNewQuestion = (io, question) => {
    io.to('global:updates').emit('question:new', question);
};

// Broadcast new answer
export const broadcastNewAnswer = (io, answer) => {
    io.to('global:updates').emit('answer:new', answer);
};

// Broadcast new prediction
export const broadcastNewPrediction = (io, prediction) => {
    io.to('global:updates').emit('prediction:new', prediction);
};

// Broadcast stock update
export const broadcastStockUpdate = (io, stock) => {
    io.to('global:updates').emit('stock:update', stock);
};

// Broadcast reputation update
export const broadcastReputationUpdate = (io, userId, reputation) => {
    io.to('global:updates').emit('reputation:update', { userId, reputation });
};
