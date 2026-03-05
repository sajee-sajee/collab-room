<div align="center">
  <img src="https://img.icons8.com/color/96/000000/code.png" alt="CollabRoom Logo" width="80" />
  <h1>CollabRoom</h1>
  <p><strong>A Real-Time Collaborative Web IDE</strong></p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-blue.svg)](https://www.postgresql.org/)
  [![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
</div>

<br />

CollabRoom is a powerful, real-time collaborative coding environment that brings your team together in a single browser tab. Designed with a premium dark-themed SaaS aesthetic, it offers low-latency code syncing, isolated execution environments, and integrated team chat.

## ✨ Features

- **Real-Time IDE:** Edit code simultaneously with teammates using the powerful Monaco Editor (the engine behind VS Code).
- **Isolated Execution:** Run untrusted code safely and securely inside dynamic Docker containers directly from the UI.
- **Integrated Team Chat:** Communicate in real-time without leaving your development environment.
- **Premium UI/UX:** A stunning, responsive interface built with Tailwind CSS, featuring an authenticated dashboard, floating modals, and a robust grid-based editor layout.
- **Multi-Language Support:** Currently supports Node.js (JavaScript) and Python execution.
- **Persistent Rooms:** Workspaces are backed by PostgreSQL, allowing you to return to your projects later.

## 🛠 Tech Stack

**Frontend:**
- [React (Vite)](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Socket.IO Client](https://socket.io/)
- [Lucide React](https://lucide.dev/) (Icons)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/) (Real-time WebSockets)
- [PostgreSQL](https://www.postgresql.org/) with `pg` (Database)
- [Dockerode](https://github.com/apocas/dockerode) (Docker Container Management)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- Node.js (v18 or higher)
- PostgreSQL
- Docker Desktop (Must be running for code execution)

### 1. Database Setup

Create a PostgreSQL database named `collab_db`:

```bash
# Log into your local postgres instance
psql -U postgres
# Create the database
CREATE DATABASE collab_db;
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5001
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/collab_db
```
*(Replace `YOUR_PASSWORD` with your actual Postgres password).*

Start the backend server. The server will automatically initialize the necessary database tables on startup:

```bash
npm run dev
# Server should output: "Server is running on port 5001"
```

### 3. Frontend Setup

In a new terminal, navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 💻 Usage

1. Open `http://localhost:5173` in your browser.
2. Click **"Log In"** or **"Sign Up"** (Currently uses a UI mock flow that bypasses strict auth for demonstration).
3. On the Dashboard, click **"New Project"** or the **"Create New Room"** card.
4. Enter a room name and select your preferred language.
5. Once inside the editor, you can share the URL with a friend to collaborate in real-time.
6. Write your JavaScript or Python code.
7. Click the purple **"RUN CODE"** button in the terminal pane to spin up a Docker container and execute your code safely.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
