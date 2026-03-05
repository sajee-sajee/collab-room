import React, { useState } from 'react';
import { X, Code2, Clock, FolderGit2 } from 'lucide-react';

const JoinRoomModal = ({ isOpen, onClose, onJoin }) => {
    const [roomKey, setRoomKey] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onJoin({ roomKey: roomKey.toUpperCase() });
    };

    const recentRooms = [
        { name: "Project Phoenix - Frontend", active: 4, time: "2 hours ago", icon: <FolderGit2 className="text-brand-purple" size={16} /> },
        { name: "API Integration Layer", active: 1, time: "yesterday", icon: <Code2 className="text-blue-500" size={16} /> },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-md rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-start p-6">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Join a Room</h2>
                        <p className="text-sm text-gray-400">Enter a code or link to collaborate in real-time.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="px-6 pb-6 pt-2">
                    <form onSubmit={handleSubmit}>

                        <div className="mb-6">
                            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Room Code or Invite Link</label>
                            <input
                                type="text"
                                value={roomKey}
                                onChange={(e) => setRoomKey(e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600 text-sm uppercase tracking-widest font-mono"
                                placeholder="e.g. ALPHA-DELTA-22"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">Recent Rooms</span>
                                <a href="#" className="text-xs text-primary font-medium hover:text-blue-400">Clear History</a>
                            </div>

                            <div className="space-y-2">
                                {recentRooms.map((room, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-800/50 transition-all text-left group"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-950 border border-gray-800 flex items-center justify-center">
                                                {room.icon}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">{room.name}</div>
                                                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                                                    <span className="flex items-center"><Clock size={10} className="mr-1" /> {room.time}</span>
                                                    <span>•</span>
                                                    <span className="text-gray-400">{room.active} active</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-gray-600 group-hover:text-primary transition-colors">
                                            <code className="text-xs font-bold font-mono">JOIN</code>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!roomKey}
                            className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3.5 rounded-lg shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Join Room
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JoinRoomModal;
