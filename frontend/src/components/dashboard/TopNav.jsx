import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';

const TopNav = ({ onCreateProject }) => {
    return (
        <header className="h-16 border-b border-gray-800 bg-background flex items-center justify-between px-8 z-10 relative">

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-500 group-hover:text-gray-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="w-full bg-surface border border-gray-800 text-gray-200 rounded-lg pl-10 pr-4 py-2 focus:ring-1 focus:ring-primary focus:border-primary focus:bg-gray-900 outline-none transition-all placeholder-gray-500 text-sm shadow-sm"
                        placeholder="Search projects or files..."
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-6 pl-8">
                <button className="relative text-gray-400 hover:text-white transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-background transform translate-x-0.5 -translate-y-0.5"></span>
                </button>

                <button
                    onClick={onCreateProject}
                    className="flex items-center space-x-2 bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-all text-sm font-semibold shadow-md shadow-blue-500/20"
                >
                    <Plus size={16} />
                    <span>New Project</span>
                </button>
            </div>
        </header>
    );
};

export default TopNav;
