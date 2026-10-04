import express from 'express';
import Docker from 'dockerode';
import { isMember, rateLimit } from '../auth.js';
import { runCode } from '../services/runner.js';

export function createExecuteRouter({ docker = new Docker(), member = isMember, runner = runCode } = {}) {
    const router = express.Router();
    let running = 0;
    router.post('/execute', rateLimit({ limit: 10, windowMs: 60000, key: req => req.user.id }), async (req, res, next) => {
        const { code, language, roomId } = req.body || {};
        if (typeof code !== 'string' || !code.trim() || Buffer.byteLength(code) > 32768 || !['javascript', 'python'].includes(language)) {
            return res.status(400).json({ error: 'Provide JavaScript or Python code up to 32 KiB.' });
        }
        try {
            if (!await member(req.user.id, roomId)) return res.status(403).json({ error: 'Join this room before running code.' });
            if (running >= 2) return res.status(429).json({ error: 'Execution capacity reached. Try again shortly.' });
            running++;
            try { res.json(await runner(docker, language, code)); }
            finally { running--; }
        } catch (error) { next(error); }
    });
    return router;
}
export default createExecuteRouter();
