import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import Docker from 'dockerode';
import { initDb } from './src/initDb.js';
import roomsRouter from './src/routes/rooms.js';
import executeRouter from './src/routes/execute.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/rooms', roomsRouter);
app.use('/api', executeRouter);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const docker = new Docker();

import { initializeSockets } from './src/sockets/index.js';

initializeSockets(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await initDb();
});
