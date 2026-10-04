import { useSocket } from './context/SocketContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';

import Dashboard from './pages/Dashboard';

function App() {
  const { user, logout } = useSocket();
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <div className="px-4 py-2 text-sm text-gray-300">Learning prototype · {user ? <><span>Signed in as {user.username}</span> <button onClick={() => logout().catch(() => {})} className="ml-4 underline">Sign out</button></> : "Sign in to create or join rooms"}</div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
