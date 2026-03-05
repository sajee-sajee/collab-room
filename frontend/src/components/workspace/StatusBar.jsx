import React from 'react';
import { GitBranch, RefreshCw, Bell } from 'lucide-react';

const StatusBar = () => {
    return (
        <div className="h-[30px] bg-primary text-white flex items-center justify-between px-3 text-[11px] font-medium tracking-wide shrink-0">
            {/* Left side */}
            <div className="flex items-center h-full space-x-4">
                <button className="flex items-center space-x-1 hover:bg-white/10 px-2 h-full transition-colors">
                    <GitBranch size={14} />
                    <span>main*</span>
                </button>

                <button className="flex items-center space-x-1 hover:bg-white/10 px-2 h-full transition-colors">
                    <RefreshCw size={12} className="opacity-80" />
                    <span>Cloud Sync</span>
                </button>
            </div>

            {/* Right side */}
            <div className="flex items-center h-full space-x-4">
                <button className="hover:bg-white/10 px-2 h-full transition-colors">Spaces: 2</button>
                <button className="hover:bg-white/10 px-2 h-full transition-colors">UTF-8</button>
                <button className="hover:bg-white/10 px-2 h-full transition-colors">TypeScript JSX</button>

                <button className="flex items-center space-x-1 hover:bg-white/10 px-2 h-full transition-colors">
                    <Bell size={12} />
                    <span>3 Notifications</span>
                </button>
            </div>
        </div>
    );
};

export default StatusBar;
