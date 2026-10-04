import { authenticate, isMember } from '../auth.js';

export const initializeSockets = (io) => {
    const roomState = new Map();
    io.use(async (socket, next) => {
        try {
            socket.data.user = await authenticate(socket.handshake.auth?.token);
            next(socket.data.user ? undefined : new Error('Please sign in.'));
        } catch { next(new Error('Authentication unavailable')); }
    });
    io.on('connection', socket => {
        // Stop idle subscribers receiving updates after session revocation/expiry.
        const expiryCheck = setInterval(async () => {
            try { if (!await authenticate(socket.handshake.auth?.token)) socket.disconnect(true); }
            catch { socket.disconnect(true); }
        }, 30000);
        expiryCheck.unref();
        socket.on('disconnect', () => clearInterval(expiryCheck));
        let windowStart = Date.now();
        let eventCount = 0;
        // Validate the session again for every event, including after logout/expiry.
        socket.use(async ([event, payload], next) => {
            if (Date.now() - windowStart > 1000) { windowStart = Date.now(); eventCount = 0; }
            if (++eventCount > 40) return next(new Error('Too many events'));
            try {
                const user = await authenticate(socket.handshake.auth?.token);
                if (!user || !await isMember(user.id, payload?.roomId)) return next(new Error('Room access denied'));
                socket.data.user = user;
                next();
            } catch { next(new Error('Room access unavailable')); }
        });
        socket.on('error', error => socket.emit('room_error', error.message));
        socket.on('join_room', ({ roomId }) => {
            for (const oldRoom of socket.rooms) {
                if (oldRoom !== socket.id && oldRoom !== roomId) {
                    socket.leave(oldRoom);
                    if (!io.sockets.adapter.rooms.has(oldRoom)) roomState.delete(oldRoom);
                }
            }
            socket.join(roomId);
            if (!roomState.has(roomId)) roomState.set(roomId, { code: '// Start coding here...', language: 'javascript', messages: [] });
            socket.emit('room_state', roomState.get(roomId));
            socket.to(roomId).emit('user_joined', { username: socket.data.user.username, socketId: socket.id });
        });
        socket.on('code_change', ({ roomId, code }) => {
            if (!socket.rooms.has(roomId) || typeof code !== 'string' || Buffer.byteLength(code) > 32768) return;
            const state = roomState.get(roomId);
            if (state) state.code = code;
            socket.to(roomId).emit('code_update', code);
        });
        socket.on('language_change', ({ roomId, language }) => {
            if (!socket.rooms.has(roomId) || !['javascript', 'python'].includes(language)) return;
            const state = roomState.get(roomId);
            if (state) state.language = language;
            socket.to(roomId).emit('language_update', language);
        });
        socket.on('send_message', ({ roomId, text }) => {
            if (!socket.rooms.has(roomId) || typeof text !== 'string' || !text.trim() || text.length > 2000) return;
            const message = { username: socket.data.user.username, text, timestamp: new Date() };
            const state = roomState.get(roomId);
            if (state) { state.messages.push(message); state.messages = state.messages.slice(-100); }
            io.to(roomId).emit('receive_message', message);
        });
        socket.on('disconnecting', () => {
            for (const roomId of socket.rooms) if (io.sockets.adapter.rooms.get(roomId)?.size === 1) roomState.delete(roomId);
        });
    });
};
