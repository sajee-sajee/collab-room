import express from 'express';
import { query } from '../db/index.js';
import { hashPassword, verifyPassword, createSession, requireAuth, rateLimit, tokenHash } from '../auth.js';

const router = express.Router();
router.use(rateLimit({ limit: 20, windowMs: 15 * 60 * 1000 }));
router.post('/:action', async (req, res, next) => {
    const { action } = req.params;
    if (!['login', 'register'].includes(action)) return next();
    const { username, password } = req.body || {};
    if (typeof username !== 'string' || !/^[a-zA-Z0-9_]{3,32}$/.test(username) ||
        typeof password !== 'string' || password.length < 12 || password.length > 128) {
        return res.status(400).json({ error: 'Use a 3–32 character username (letters, digits, underscore) and a 12–128 character password.' });
    }
    try {
        let user;
        if (action === 'register') {
            const hash = await hashPassword(password);
            const result = await query('INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username', [username.toLowerCase(), hash]);
            user = result.rows[0];
        } else {
            const result = await query('SELECT id, username, password_hash FROM users WHERE username = $1', [username.toLowerCase()]);
            const found = result.rows[0];
            if (!found || !await verifyPassword(password, found.password_hash)) return res.status(401).json({ error: 'Invalid username or password.' });
            user = { id: found.id, username: found.username };
        }
        res.status(action === 'register' ? 201 : 200).json({ user, token: await createSession(user.id) });
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ error: 'Username unavailable.' });
        next(error);
    }
});
router.post('/logout', requireAuth, async (req, res, next) => {
    try {
        await query('DELETE FROM sessions WHERE token_hash = $1', [tokenHash(req.headers.authorization.slice(7))]);
        res.sendStatus(204);
    } catch (error) { next(error); }
});
router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));
export default router;
