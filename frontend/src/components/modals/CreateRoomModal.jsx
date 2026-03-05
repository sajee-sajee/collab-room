import React, { useState } from 'react';
import { X, Folder, Code2, Globe, Lock, Users } from 'lucide-react';

const CreateRoomModal = ({ isOpen, onClose, onCreate }) => {
    const [roomName, setRoomName] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [privacy, setPrivacy] = useState('Public');
    const [invites, setInvites] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Uses the current backend logic (which needs a username)
        // Since we don't have real auth yet, we'll prompt for username in Home,
        // or just use a default "Creator" name if not provided.
        onCreate({ roomName, language, privacy });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-surface w-full max-w-lg rounded-2xl border border-gray-800 shadow-2xl relative overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-gray-800">
                    <div>
                        <h2 className="text-xl font-bold text-white mb-1">Create a New Room</h2>
                        <p className="text-sm text-gray-400">Set up your collaborative environment</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className="p-6">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-2">Room Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Folder size={16} className="text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600 text-sm"
                                    placeholder="e.g. backend-sprint-01"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-2">Primary Language</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Code2 size={16} className="text-gray-500" />
                                    </div>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="javascript">JavaScript (Node)</option>
                                        <option value="python">Python 3</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-2">Privacy Setting</label>
                                <div className="flex bg-gray-950 border border-gray-800 rounded-lg p-1">
                                    <button
                                        type="button"
                                        onClick={() => setPrivacy('Public')}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-md transition-all ${privacy === 'Public' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        <Globe size={14} />
                                        <span>Public</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPrivacy('Private')}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-2 text-xs font-semibold rounded-md transition-all ${privacy === 'Private' ? 'bg-brand-purple/20 text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
                                    >
                                        <Lock size={14} />
                                        <span>Private</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-300 mb-2">Invite Team Members</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Users size={16} className="text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    value={invites}
                                    onChange={(e) => setInvites(e.target.value)}
                                    className="w-full bg-gray-950 border border-gray-800 text-white rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-600 text-sm"
                                    placeholder="Enter emails separated by commas"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-brand-purple hover:bg-brand-purple/80 text-white font-semibold py-3 rounded-lg shadow-lg transition-colors mt-4"
                        >
                            Create Room
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateRoomModal;
