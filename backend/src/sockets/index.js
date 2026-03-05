export const initializeSockets = (io) => {
    // In-memory state for simplicity during collab
    // Structure: { roomId: { code: string, language: string, messages: [] } }
    const roomState = new Map();

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on('join_room', ({ roomId, username }) => {
            socket.join(roomId);
            console.log(`${username} joined room: ${roomId}`);

            // Initialize room state if it doesn't exist
            if (!roomState.has(roomId)) {
                roomState.set(roomId, {
                    code: '// Start coding here...',
                    language: 'javascript',
                    messages: []
                });
            }

            // Send current state to the joining user
            const currentState = roomState.get(roomId);
            socket.emit('room_state', currentState);

            socket.to(roomId).emit('user_joined', { username, socketId: socket.id });
        });

        socket.on('code_change', ({ roomId, code }) => {
            // Update state
            if (roomState.has(roomId)) {
                roomState.get(roomId).code = code;
            }
            // Broadcast to other users in the room
            socket.to(roomId).emit('code_update', code);
        });

        socket.on('language_change', ({ roomId, language }) => {
            if (roomState.has(roomId)) {
                roomState.get(roomId).language = language;
            }
            socket.to(roomId).emit('language_update', language);
        });

        socket.on('send_message', ({ roomId, username, text }) => {
            const message = { username, text, timestamp: new Date() };
            if (roomState.has(roomId)) {
                roomState.get(roomId).messages.push(message);
            }
            io.to(roomId).emit('receive_message', message);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
