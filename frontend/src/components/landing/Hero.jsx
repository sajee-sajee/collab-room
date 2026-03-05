import React from 'react';

const Hero = ({ onCreateRoom, onJoinRoom }) => {
    return (
        <section className="flex flex-col items-center justify-center text-center pt-24 pb-16 px-4">
            {/* Beta Badge */}
            <div className="bg-brand-blue/20 text-blue-400 border border-brand-blue/30 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-8 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
                <span>New Integrated Voice Channels</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl leading-tight">
                Code Together, <span className="bg-gradient-text bg-clip-text text-transparent">Anywhere</span>
            </h1>

            {/* Description */}
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
                Experience real-time collaborative coding with shared terminals, low-latency syncing, and integrated chat. Built for high-performance development teams.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
                <button
                    onClick={onCreateRoom}
                    className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-8 py-3.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/25"
                >
                    Create a Room
                </button>
                <button
                    onClick={onJoinRoom}
                    className="w-full sm:w-auto bg-surface hover:bg-surface-hover border border-gray-800 text-white px-8 py-3.5 rounded-lg font-semibold transition-colors"
                >
                    Join Room
                </button>
            </div>

            {/* Terminal Illustration Mock */}
            <div className="w-full max-w-5xl h-80 md:h-[450px] bg-background border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative group">
                {/* Fake Terminal Header */}
                <div className="h-12 border-b border-gray-800 bg-surface/50 flex items-center px-4 space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                {/* Fake Code Lines */}
                <div className="p-6 space-y-3 opacity-60">
                    <div className="h-3 w-1/3 bg-gray-700/50 rounded"></div>
                    <div className="h-3 w-1/2 bg-gray-700/50 rounded ml-4"></div>
                    <div className="h-3 w-2/5 bg-gray-700/50 rounded ml-8"></div>
                    <div className="h-3 w-[15%] bg-primary/40 rounded ml-8"></div>
                    <div className="h-3 w-3/4 bg-brand-purple/40 rounded ml-4"></div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80"></div>
            </div>
        </section>
    );
};

export default Hero;
