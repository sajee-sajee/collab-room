import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './src/initDb.js';
import roomsRouter from './src/routes/rooms.js';
import executeRouter from './src/routes/execute.js';
import authRouter from './src/routes/auth.js';
import { requireAuth, rateLimit } from './src/auth.js';
import { initializeSockets } from './src/sockets/index.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
app.use(cors({ origin }));
app.use(express.json({ limit: '64kb' }));
app.use('/api/auth', authRouter);
app.use('/api', requireAuth);
app.use('/api/rooms', rateLimit({ limit: 30, windowMs: 60000, key: req => req.user.id }), roomsRouter);
app.use('/api', executeRouter);
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500).json({ error: error.status === 413 ? 'Request too large' : 'Request failed' });
});
const io = new Server(server, { cors: { origin }, maxHttpBufferSize: 65536 });
initializeSockets(io);
const PORT = process.env.PORT || 5001;
// Fail startup if migrations cannot complete; do not serve against a broken schema.
await initDb();
server.listen(PORT, process.env.HOST || '127.0.0.1', () => console.log(`Server listening on port ${PORT}`));
