import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import TopNav from '../components/dashboard/TopNav';
import { CreateRoomCard } from '../components/dashboard/RoomCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import CreateRoomModal from '../components/modals/CreateRoomModal';
import JoinRoomModal from '../components/modals/JoinRoomModal';
import { useSocket } from '../context/SocketContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { connectSocket, setUser } = useSocket();

    // Modal states
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false); // Can be triggered by another button if we want

    const generateDashboardName = () => `Dev_${Math.floor(Math.random() * 10000)}`;

    const handleCreateRoom = async ({ roomName, language, privacy }) => {
        const username = generateDashboardName();
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

    return (
        <div className="flex h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <TopNav onCreateProject={() => setIsCreateOpen(true)} />

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Active Coding Rooms</h1>
                            <p className="text-gray-400 text-sm">Continue where you left off with your team.</p>
                        </div>

                        {/* Room Grid */}
                        <div className="flex flex-wrap gap-6">
                            <CreateRoomCard onClick={() => setIsCreateOpen(true)} />

                            {/* Empty state for now since the user requested no mock data */}
                        </div>
                    </div>
                </main>
            </div>

            <ActivityFeed />

            {/* Modals integrated into the dashboard workflow */}
            <CreateRoomModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onCreate={handleCreateRoom}
            />
        </div>
    );
};

export default Dashboard;
