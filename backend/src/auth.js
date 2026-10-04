import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { query } from './db/index.js';

const scrypt = promisify(scryptCallback);
export const tokenHash = (token) => createHash('sha256').update(token).digest('hex');

export async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const hash = await scrypt(password, salt, 64);
    return `${salt}:${hash.toString('hex')}`;
}

export async function verifyPassword(password, stored) {
    if (!stored || !/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(stored)) return false;
    const [salt, expected] = stored.split(':');
    const actual = await scrypt(password, salt, 64);
    return timingSafeEqual(actual, Buffer.from(expected, 'hex'));
}

export async function createSession(userId) {
    const token = randomBytes(32).toString('hex');
    await query('DELETE FROM sessions WHERE expires_at <= NOW()');
    await query("INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, NOW() + INTERVAL '8 hours')", [tokenHash(token), userId]);
    return token;
}

export async function authenticate(token) {
    if (typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token)) return null;
    const result = await query('SELECT users.id, users.username FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = $1 AND expires_at > NOW()', [tokenHash(token)]);
    return result.rows[0] || null;
}

export async function requireAuth(req, res, next) {
    try {
        req.user = await authenticate(req.headers.authorization?.replace(/^Bearer /, ''));
        if (!req.user) return res.status(401).json({ error: 'Please sign in.' });
        next();
    } catch (error) { next(error); }
}

export async function isMember(userId, roomKey) {
    if (typeof roomKey !== 'string' || !/^[A-F0-9]{6}$/.test(roomKey)) return false;
    const result = await query('SELECT 1 FROM room_members m JOIN rooms r ON r.id = m.room_id WHERE m.user_id = $1 AND r.room_key = $2', [userId, roomKey]);
    return result.rows.length > 0;
}

// Single-process limiter. Use a shared store before running multiple replicas.
export function rateLimit({ limit, windowMs, key = (req) => req.ip }) {
    const requests = new Map();
    return (req, res, next) => {
        const now = Date.now();
        for (const [id, entry] of requests) if (entry.reset <= now) requests.delete(id);
        const id = key(req);
        const entry = requests.get(id) || { count: 0, reset: now + windowMs };
        requests.set(id, entry);
        if (++entry.count > limit) {
            res.set('Retry-After', String(Math.ceil((entry.reset - now) / 1000)));
            return res.status(429).json({ error: 'Too many requests. Try again later.' });
        }
        next();
    };
}
