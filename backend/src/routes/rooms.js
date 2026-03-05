import express from 'express';
import { query } from '../db/index.js';
import crypto from 'crypto';

const router = express.Router();

// Generate a random 6-character room key
const generateRoomKey = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Create a new room
router.post('/create', async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        // 1. Create or find user
        let userRes = await query('SELECT * FROM users WHERE username = $1', [username]);
        if (userRes.rows.length === 0) {
            userRes = await query('INSERT INTO users (username) VALUES ($1) RETURNING *', [username]);
        }
        const user = userRes.rows[0];

        // 2. Create room
        let roomKey;
        let isUnique = false;
        while (!isUnique) {
            roomKey = generateRoomKey();
            const existingRoom = await query('SELECT id FROM rooms WHERE room_key = $1', [roomKey]);
            if (existingRoom.rows.length === 0) {
                isUnique = true;
            }
        }

        const roomRes = await query(
            'INSERT INTO rooms (room_key, leader_id) VALUES ($1, $2) RETURNING *',
            [roomKey, user.id]
        );
        const room = roomRes.rows[0];

        // 3. Add user as leader in room_members
        await query(
            'INSERT INTO room_members (room_id, user_id, role) VALUES ($1, $2, $3)',
            [room.id, user.id, 'leader']
        );

        res.status(201).json({
            room: {
                id: room.id,
                roomKey: room.room_key,
                leaderId: room.leader_id
            },
            user: {
                id: user.id,
                username: user.username,
                role: 'leader'
            }
        });

    } catch (err) {
        console.error('Error creating room:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Join an existing room
router.post('/join', async (req, res) => {
    const { username, roomKey } = req.body;

    if (!username || !roomKey) {
        return res.status(400).json({ error: 'Username and Room Key are required' });
    }

    try {
        // 1. Create or find user
        let userRes = await query('SELECT * FROM users WHERE username = $1', [username]);
        if (userRes.rows.length === 0) {
            userRes = await query('INSERT INTO users (username) VALUES ($1) RETURNING *', [username]);
        }
        const user = userRes.rows[0];

        // 2. Find room
        const roomRes = await query('SELECT * FROM rooms WHERE room_key = $1', [roomKey]);
        if (roomRes.rows.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }
        const room = roomRes.rows[0];

        // 3. Add user as member if not already joined
        const memberRes = await query(
            'SELECT * FROM room_members WHERE room_id = $1 AND user_id = $2',
            [room.id, user.id]
        );

        let role = 'member';
        if (memberRes.rows.length === 0) {
            await query(
                'INSERT INTO room_members (room_id, user_id, role) VALUES ($1, $2, $3)',
                [room.id, user.id, 'member']
            );
        } else {
            role = memberRes.rows[0].role;
        }

        res.status(200).json({
            room: {
                id: room.id,
                roomKey: room.room_key,
                leaderId: room.leader_id
            },
            user: {
                id: user.id,
                username: user.username,
                role: role
            }
        });

    } catch (err) {
        console.error('Error joining room:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
