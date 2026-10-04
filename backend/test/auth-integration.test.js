import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

// Uses a dedicated PostgreSQL database supplied by CI, never a production database.
test('registration, sessions, rooms and logout against PostgreSQL', { skip: !process.env.TEST_DATABASE_URL, timeout: 30000 }, async t => {
    const port = 15001;
    const child = spawn(process.execPath, ['index.js'], {
        cwd: new URL('..', import.meta.url),
        env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL, PORT: String(port), HOST: '127.0.0.1' },
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    let logs = '';
    child.stdout.on('data', data => { logs += data; });
    child.stderr.on('data', data => { logs += data; });
    t.after(() => { child.kill(); });
    const request = (path, body, token) => fetch(`http://127.0.0.1:${port}/api${path}`, {
        method: body === undefined ? 'GET' : 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    let ready = false;
    for (let i = 0; i < 80; i++) {
        try { await request('/auth/me'); ready = true; break; } catch { await delay(100); }
    }
    assert.ok(ready, `Backend failed to start: ${logs}`);
    assert.equal((await request('/rooms/create', {})).status, 401);
    const username = `test_${Date.now()}`;
    const credentials = { username, password: 'correct-password-for-test' };
    const registration = await request('/auth/register', credentials);
    assert.equal(registration.status, 201);
    const first = await registration.json();
    assert.equal((await request('/auth/register', credentials)).status, 409);
    assert.equal((await request('/auth/login', { ...credentials, password: 'incorrect-password' })).status, 401);
    const login = await request('/auth/login', credentials);
    assert.equal(login.status, 200);
    const { token } = await login.json();
    assert.equal((await request('/auth/me', undefined, token)).status, 200);
    const roomResponse = await request('/rooms/create', { username: 'someone_else' }, token);
    assert.equal(roomResponse.status, 201);
    const room = await roomResponse.json();
    assert.equal(room.user.id, first.user.id, 'body cannot spoof identity');
    const secondResponse = await request('/auth/register', { username: `${username}_b`, password: credentials.password });
    const second = await secondResponse.json();
    assert.equal((await request('/execute', { roomId: room.room.roomKey, language: 'python', code: 'print(1)' }, second.token)).status, 403);
    assert.equal((await request('/rooms/join', { roomKey: room.room.roomKey }, second.token)).status, 200);
    assert.equal((await request('/auth/logout', {}, token)).status, 204);
    assert.equal((await request('/auth/me', undefined, token)).status, 401);
});
