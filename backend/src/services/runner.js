import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export function decodeLogs(buffer) {
    const chunks = [];
    for (let offset = 0; offset + 8 <= buffer.length;) {
        const size = buffer.readUInt32BE(offset + 4);
        if (offset + 8 + size > buffer.length) break;
        chunks.push(buffer.subarray(offset + 8, offset + 8 + size));
        offset += 8 + size;
    }
    return Buffer.concat(chunks).subarray(0, 65536).toString('utf8');
}

export async function runCode(docker, language, code, timeoutMs = 5000) {
    const config = {
        javascript: ['node:22-alpine', 'node', 'script.js'],
        python: ['python:3.12-alpine', 'python', 'script.py'],
    }[language];
    if (!config) throw new Error('Unsupported language');
    const [image, command, filename] = config;
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'collab-'));
    let container;
    let timer;
    try {
        await fs.chmod(directory, 0o755);
        await fs.writeFile(path.join(directory, filename), code, { mode: 0o644 });
        container = await docker.createContainer({
            Image: image, Cmd: [command, filename], Tty: false,
            User: '65534:65534', WorkingDir: '/usr/src/app',
            HostConfig: {
                Binds: [`${directory}:/usr/src/app:ro`], Memory: 100 * 1024 * 1024,
                MemorySwap: 100 * 1024 * 1024, NanoCpus: 500000000, PidsLimit: 64,
                NetworkMode: 'none', ReadonlyRootfs: true, CapDrop: ['ALL'],
                SecurityOpt: ['no-new-privileges'], Tmpfs: { '/tmp': 'rw,noexec,nosuid,size=16m' },
                LogConfig: { Type: 'local', Config: { 'max-size': '1m', 'max-file': '1' } },
            },
        });
        await container.start();
        const status = await Promise.race([
            container.wait(),
            new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Execution Timeout')), timeoutMs); }),
        ]);
        const output = decodeLogs(await container.logs({ stdout: true, stderr: true, tail: 1000 }));
        return status.StatusCode === 0
            ? { success: true, output }
            : { success: false, output, error: `Process exited with code ${status.StatusCode}` };
    } catch (error) {
        return { success: false, error: error.message || 'Execution failed' };
    } finally {
        clearTimeout(timer);
        if (container) await container.remove({ force: true }).catch(error => console.error('Container cleanup failed:', error.message));
        await fs.rm(directory, { recursive: true, force: true });
    }
}
