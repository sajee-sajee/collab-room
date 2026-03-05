import React from 'react';
import { Code2, Share2, User } from 'lucide-react';

const WorkspaceHeader = ({ projectName = "Fintech_Dashboard_v2", activeUsers = [] }) => {
    return (
        <header className="h-[52px] bg-background border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
            {/* Left side: Logo & Project Name */}
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-primary">
                    <Code2 size={24} />
                    <span className="font-bold text-lg tracking-wide hidden sm:block">CollabRoom</span>
                </div>

                <div className="h-6 w-px bg-gray-800 hidden sm:block"></div>

                <div className="flex flex-col justify-center">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest leading-none mb-1">Project</span>
                    <span className="text-sm font-semibold text-gray-200 leading-none">{projectName}</span>
                </div>
            </div>

            {/* Right side: App Actions & Users */}
            <div className="flex items-center space-x-4">
                {/* Active Users */}
                <div className="flex -space-x-2 mr-2">
                    {/* Fake avatars based on the screenshot */}
                    <div className="w-8 h-8 rounded-full border-2 border-background bg-orange-200 overflow-hidden relative z-30">
                        {/* Fake image using CSS gradient */}
                        <div className="w-full h-full bg-gradient-to-br from-orange-300 to-amber-500"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-background bg-blue-200 overflow-hidden relative z-20">
                        <div className="w-full h-full bg-gradient-to-br from-blue-300 to-cyan-500"></div>
                    </div>
                    {activeUsers.length > 2 && (
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-300 relative z-10">
                            +{activeUsers.length - 2}
                        </div>
                    )}
                </div>

                <button className="flex items-center space-x-2 bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded-md transition-colors text-sm font-semibold tracking-wide">
                    <Share2 size={16} />
                    <span>Share</span>
                </button>

                <button className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                    <User size={18} />
                </button>
            </div>
        </header>
    );
};

export default WorkspaceHeader;
