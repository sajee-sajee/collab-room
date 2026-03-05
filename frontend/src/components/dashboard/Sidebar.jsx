import React from 'react';
import { NavLink } from 'react-router-dom';
import { Code2, Home, FolderGit2, LayoutTemplate, Settings, LogOut } from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

const Sidebar = () => {
    const { user } = useSocket();

    // We'll use a placeholder user if not logged in for the UI
    const displayName = user?.username || 'Guest User';

    return (
        <aside className="w-64 bg-surface border-r border-gray-800 flex flex-col h-full relative z-20 shrink-0">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <div className="flex items-center space-x-2 text-white">
                    <div className="bg-primary p-1.5 rounded-lg">
                        <Code2 size={20} className="text-white" />
                    </div>
                    <div>
                        <span className="font-bold text-lg tracking-wide block leading-none">CollabRoom</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold tracking-wide">Dev Workspace</span>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
                <NavLink
                    to="/dashboard"
                    end
                    className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`
                    }
                >
                    <Home size={18} />
                    <span>Home</span>
                </NavLink>

                <NavLink
                    to="/dashboard/rooms"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`
                    }
                >
                    <FolderGit2 size={18} />
                    <span>My Rooms</span>
                </NavLink>

                <NavLink
                    to="/dashboard/templates"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`
                    }
                >
                    <LayoutTemplate size={18} />
                    <span>Templates</span>
                </NavLink>

                <NavLink
                    to="/dashboard/settings"
                    className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`
                    }
                >
                    <Settings size={18} />
                    <span>Settings</span>
                </NavLink>
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-gray-800 mt-auto">
                <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-800/50 p-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-200 flex items-center justify-center text-orange-900 font-bold text-sm">
                            {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-200 leading-none mb-1">{displayName}</span>
                            <span className="text-[10px] text-gray-500 font-medium leading-none">Pro Account</span>
                        </div>
                    </div>
                    <LogOut size={16} className="text-gray-500 group-hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100" />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
