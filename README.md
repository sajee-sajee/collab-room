# CollabRoom

A learning prototype for collaborative editing, chat and Docker-based JavaScript/Python execution.

## Implemented

- Username/password registration and sign-in (scrypt password hashes)
- Random, hashed server-side session tokens with an eight-hour lifetime and logout
- PostgreSQL room membership checked by HTTP and Socket.IO handlers
- Monaco editor, code updates and bounded in-memory chat history
- Execution quotas, two concurrent runs per process and five-second execution timeouts
- Non-root containers with no network, read-only root filesystem, memory/CPU/PID limits and bounded returned logs

**Status:** suitable for local development and review. Docker restrictions are defense in depth, not a guarantee that hostile code is safe. Do not expose a shared developer Docker daemon as a public execution service.

## Setup

Requires Node.js 22, npm, PostgreSQL and a local Docker engine on the backend machine. Docker Desktop must permit bind mounts from the OS temporary directory.

```bash
git clone https://github.com/sajee-sajee/collab-room.git
cd collab-room
createdb collab_db
docker pull node:22-alpine
docker pull python:3.12-alpine
cd backend
npm ci
cp .env.example .env
```

Set your PostgreSQL credentials in `backend/.env`:

```dotenv
PORT=5001
HOST=127.0.0.1
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/collab_db
FRONTEND_ORIGIN=http://localhost:5173
```

```bash
npm run dev
```

Database tables are initialized before the server accepts traffic. Existing guest users receive no password automatically: register a new username. Existing guest rooms are not automatically assigned to new accounts.

In a second terminal:

```bash
cd collab-room/frontend
npm ci
cp .env.example .env
npm run dev
```

The frontend uses `VITE_API_URL=http://localhost:5001`. Open `http://localhost:5173`; configure the backend origin if Vite uses a different port.

## Demonstrate the project

1. Register with a username (3–32 letters, digits or underscores) and password (12–128 characters).
2. Create a room, then copy the six-character room key from its URL.
3. In another browser session, register a second account and join using that key.
4. Edit code and send a chat message to observe synchronization.
5. Run `console.log("Hello from CollabRoom")` and inspect its output.
6. Run an infinite loop to check the timeout error, then run the greeting again.
7. Sign out. Requests using the revoked session should be rejected.

Room keys are invitations: any authenticated user who knows a key can join. They are not a substitute for private invitations or administrator-controlled access.

## Validation

```bash
cd backend
npm test
cd ../frontend
npm run build
```

The backend suite checks password verification, access rejection, rate limiting, execution input and room membership, Unicode output, failure handling and cleanup. CI also runs registration, session, room access and logout checks against a dedicated PostgreSQL service. Locally this integration test is skipped unless `TEST_DATABASE_URL` is set. Docker calls are mocked in unit tests; use the demonstration above to verify a real Docker/PostgreSQL environment.

## Architecture and limitations

React → Express/Socket.IO → PostgreSQL; the execution route starts short-lived Docker containers.

- Room membership persists; editor contents and chat are in memory and disappear when the last participant leaves or the backend restarts.
- User sessions are stored in browser session storage; reloading currently requires signing in again. Password reset, email verification and OAuth are not implemented.
- Some dashboard, pricing and workspace controls remain presentation prototypes. Room title/language/privacy choices are not all persisted.
- Rate limits, concurrency and collaboration state are process-local. Multiple replicas require shared coordination.
- Use HTTPS, isolated execution workers, monitoring, backups and a security review before a public deployment.
- Automated checks do not establish production readiness or a completed security audit.
