import express from 'express';
import Docker from 'dockerode';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();
const docker = new Docker();

const runCodeInContainer = async (image, cmd, codeFilename, codeContent) => {
    const tempDir = path.join(process.cwd(), 'temp', Date.now().toString());

    try {
        await fs.mkdir(tempDir, { recursive: true });
        const filePath = path.join(tempDir, codeFilename);
        await fs.writeFile(filePath, codeContent);

        const container = await docker.createContainer({
            Image: image,
            Cmd: cmd,
            Tty: false,
            HostConfig: {
                Binds: [`${tempDir}:/usr/src/app`],
                Memory: 100 * 1024 * 1024, // 100MB limit
                NetworkMode: 'none' // Disable network for security
            },
            WorkingDir: '/usr/src/app',
        });

        await container.start();

        // Enforce a hard timeout
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => {
                container.kill().catch(() => { });
                reject(new Error('Execution Timeout'));
            }, 5000)
        );

        await Promise.race([container.wait(), timeoutPromise]);

        const logs = await container.logs({ stdout: true, stderr: true });
        // Strip docker log headers (first 8 bytes per line)
        const output = logs.toString('utf-8').replace(/[^\x20-\x7E\n]/g, '');

        await container.remove();
        return { success: true, output };
    } catch (err) {
        return { success: false, error: err.message || 'Execution failed' };
    } finally {
        await fs.rm(tempDir, { recursive: true, force: true }).catch(console.error);
    }
};


router.post('/execute', async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ error: 'Code and language are required' });
    }

    try {
        let result;
        if (language === 'javascript') {
            result = await runCodeInContainer('node:18-alpine', ['node', 'script.js'], 'script.js', code);
        } else if (language === 'python') {
            result = await runCodeInContainer('python:3.9-alpine', ['python', 'script.py'], 'script.py', code);
        } else {
            return res.status(400).json({ error: 'Unsupported language' });
        }

        res.json(result);

    } catch (error) {
        console.error('Execution error:', error);
        res.status(500).json({ error: 'Internal server error during execution' });
    }
});

export default router;
