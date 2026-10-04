import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import express from 'express';
import { hashPassword, verifyPassword, requireAuth, rateLimit } from '../src/auth.js';
import { runCode, decodeLogs } from '../src/services/runner.js';
import { createExecuteRouter } from '../src/routes/execute.js';

function frame(text) {
    const payload = Buffer.from(text);
    const header = Buffer.alloc(8); header[0] = 1; header.writeUInt32BE(payload.length, 4);
    return Buffer.concat([header, payload]);
}
test('passwords are salted and incorrect passwords rejected', async () => {
    const first = await hashPassword('long-test-password');
    assert.notEqual(first, await hashPassword('long-test-password'));
    assert.equal(await verifyPassword('long-test-password', first), true);
    assert.equal(await verifyPassword('wrong-password', first), false);
    assert.equal(await verifyPassword('long-test-password', null), false);
});
test('log framing preserves Unicode and tabs', () => {
    assert.equal(decodeLogs(Buffer.concat([frame('hello\t'), frame('കേരളം\n')])), 'hello\tകേരളം\n');
});
for (const mode of ['success', 'timeout', 'start-error', 'exit-error']) {
    test(`runner cleans up container and files after ${mode}`, async () => {
        let removed = false, directory, options;
        const container = {
            start: async () => { if (mode === 'start-error') throw Error('start failed'); },
            wait: () => mode === 'timeout' ? new Promise(() => {}) : Promise.resolve({ StatusCode: mode === 'exit-error' ? 1 : 0 }),
            logs: async () => frame('result'),
            remove: async opts => { assert.equal(opts.force, true); removed = true; },
        };
        const docker = { createContainer: async opts => {
            options = opts; directory = opts.HostConfig.Binds[0].split(':')[0];
            return container;
        } };
        const result = await runCode(docker, 'python', 'print(1)', 10);
        assert.equal(result.success, mode === 'success');
        assert.equal(removed, true);
        await assert.rejects(fs.access(directory));
        assert.equal(options.HostConfig.NetworkMode, 'none');
        assert.equal(options.HostConfig.ReadonlyRootfs, true);
        assert.equal(options.User, '65534:65534');
    });
}
test('anonymous execution is rejected before a runner is reached', async () => {
    let nextCalled = false, status;
    await requireAuth({ headers: {} }, { status: code => { status = code; return { json() {} }; } }, () => { nextCalled = true; });
    assert.equal(status, 401); assert.equal(nextCalled, false);
});
test('rate limiter rejects excess requests', () => {
    let allowed = 0, rejected = 0;
    const middleware = rateLimit({ limit: 2, windowMs: 60000 });
    const res = { set() {}, status(code) { assert.equal(code, 429); rejected++; return { json() {} }; } };
    for (let i = 0; i < 3; i++) middleware({ ip: 'local' }, res, () => allowed++);
    assert.equal(allowed, 2); assert.equal(rejected, 1);
});
test('execution checks membership and input before launching containers', async t => {
    let launches = 0;
    const app = express(); app.use(express.json());
    app.use((req, res, next) => { req.user = { id: 1 }; next(); });
    app.use(createExecuteRouter({ member: async (user, room) => room === 'ABC123', runner: async () => { launches++; return { success: true }; } }));
    const server = app.listen(0, '127.0.0.1');
    await new Promise(resolve => server.once('listening', resolve));
    t.after(() => new Promise(resolve => server.close(resolve)));
    const url = `http://127.0.0.1:${server.address().port}/execute`;
    const post = body => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    assert.equal((await post({ code: 'print(1)', language: 'python', roomId: 'BAD123' })).status, 403);
    assert.equal((await post({ code: {}, language: 'python', roomId: 'ABC123' })).status, 400);
    assert.equal(launches, 0);
    assert.equal((await post({ code: 'print(1)', language: 'python', roomId: 'ABC123' })).status, 200);
    assert.equal(launches, 1);
});
