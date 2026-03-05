import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

// Components
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Pricing from '../components/landing/Pricing';
import CTA from '../components/landing/CTA';

// Modals
import AuthModal from '../components/modals/AuthModal';
import CreateRoomModal from '../components/modals/CreateRoomModal';
import JoinRoomModal from '../components/modals/JoinRoomModal';

const Home = () => {
    const navigate = useNavigate();
    const { connectSocket, setUser } = useSocket();

    // Modal States
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState(true); // true = login, false = signup
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);

    // Existing Backend Logic integration (Username is still required by backend)
    // For this UI, we will auto-generate a username if not logged in to keep the UX smooth,
    // or we could prompt for it. For now, we'll use a random guest name.
    const generateGuestName = () => `Dev_${Math.floor(Math.random() * 10000)}`;

    const handleCreateRoom = async ({ roomName, language, privacy }) => {
        const username = generateGuestName();
        try {
            const res = await fetch('http://localhost:5001/api/rooms/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username })
            });
            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                connectSocket();
                setIsCreateOpen(false);
                navigate(`/room/${data.room.roomKey}`);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to connect to backend");
        }
    };

    const handleJoinRoomSubmit = async ({ roomKey }) => {
        const username = generateGuestName();
        try {
            const res = await fetch('http://localhost:5001/api/rooms/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, roomKey })
            });
            const data = await res.json();

            if (res.ok) {
                setUser(data.user);
                connectSocket();
                setIsJoinOpen(false);
                navigate(`/room/${data.room.roomKey}`);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to connect to backend");
        }
    };

    // Handlers for Header buttons
    const openLogin = () => {
        setAuthMode(true);
        setIsAuthOpen(true);
    };

    const openSignUp = () => {
        setAuthMode(false);
        setIsAuthOpen(true);
    };

    return (
        <div className="min-h-screen bg-background text-gray-100 font-sans selection:bg-primary/30 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-brand-blue/20 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-screen opacity-50"></div>

            <Header onLogin={openLogin} onSignUp={openSignUp} />

            <main>
                <Hero
                    onCreateRoom={() => setIsCreateOpen(true)}
                    onJoinRoom={() => setIsJoinOpen(true)}
                />

                <Features />

                <Pricing />

                <CTA onCreateRoom={() => setIsCreateOpen(true)} />
            </main>

            {/* Modals */}
            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                defaultIsLogin={authMode}
            />

            <CreateRoomModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreateRoom}
            />

            <JoinRoomModal
                isOpen={isJoinOpen}
                onClose={() => setIsJoinOpen(false)}
                onJoin={handleJoinRoomSubmit}
            />
        </div>
    );
};

export default Home;
