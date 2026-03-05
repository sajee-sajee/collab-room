import React from 'react';
import { Lock } from 'lucide-react';

// For the empty state / create button card
export const CreateRoomCard = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="h-64 border-2 border-dashed border-gray-700 bg-surface/30 hover:bg-surface/50 rounded-2xl flex flex-col items-center justify-center transition-all group flex-1 min-w-[280px] max-w-sm"
        >
            <div className="w-12 h-12 rounded-full bg-gray-800 group-hover:bg-gray-700 flex items-center justify-center mb-4 transition-colors">
                <span className="text-gray-400 group-hover:text-white text-2xl font-light">+</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-1 relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-px after:bg-primary group-hover:after:w-[80%] after:transition-all after:duration-300">Create New Room</h3>
            <p className="text-gray-500 text-sm">Start a fresh project</p>
        </button>
    );
};

// For existing active rooms
export const ActiveRoomCard = ({ title, description, badgeIcon, badgeText, badgeColor, privacyLabel, avatars = [], activeTime, onJoin }) => {

    // Map badgeColor string to actual tailwind classes
    const colorMap = {
        blue: 'bg-primary text-white',
        purple: 'bg-brand-purple text-white',
    };

    return (
        <div className="h-64 bg-surface border border-gray-800 rounded-2xl p-6 flex flex-col justify-between hover:border-gray-700 transition-all flex-1 min-w-[280px] max-w-sm group relative overflow-hidden">
            {/* Highlight glow on hover */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${colorMap[badgeColor] || 'bg-gray-800 text-white'} shadow-md`}>
                        {badgeIcon || title.substring(0, 2).toUpperCase()}
                    </div>

                    {privacyLabel && (
                        <div className="flex items-center space-x-1 bg-gray-900/80 border border-gray-800 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase text-gray-500">
                            {privacyLabel === 'PRIVATE' && <Lock size={10} className="mr-0.5" />}
                            {privacyLabel}
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 leading-tight">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {description}
                </p>
            </div>

            <div className="flex justify-between items-end mt-4">
                <div className="flex -space-x-2">
                    {avatars.slice(0, 3).map((avatar, i) => (
                        <div key={i} className={`w-8 h-8 rounded-full border-2 border-surface flex items-center justify-center text-xs font-bold text-white shadow-sm`} style={{ backgroundColor: avatar.bg }}>
                            {avatar.initials}
                        </div>
                    ))}
                    {avatars.length > 3 && (
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-400 shadow-sm z-10">
                            +{avatars.length - 3}
                        </div>
                    )}
                </div>

                <div className="text-xs text-gray-500 font-medium flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                    Active {activeTime} ago
                </div>
            </div>

            {/* Hidden Join button overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                    onClick={onJoin}
                    className="bg-white text-black font-bold px-6 py-2 rounded-lg shadow-xl hover:bg-gray-100 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-200"
                >
                    Join Room
                </button>
            </div>
        </div>
    );
};
