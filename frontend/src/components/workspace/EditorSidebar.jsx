import React from 'react';
import { FilePlus, Upload } from 'lucide-react';

const EditorSidebar = () => {
    return (
        <aside className="w-64 bg-background border-r border-gray-800 h-full flex flex-col shrink-0 hidden md:flex">
            <div className="h-[40px] flex items-center px-4 border-b border-gray-800">
                <span className="text-xs font-bold tracking-widest text-gray-500 uppercase">Explorer</span>
            </div>

            <div className="p-4 space-y-3">
                {/* As per user request: static placeholder buttons, no real file logic yet */}
                <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg border border-gray-800 bg-surface hover:bg-gray-800 text-gray-300 transition-colors text-sm font-medium">
                    <FilePlus size={16} className="text-gray-400" />
                    <span>New File</span>
                </button>

                <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg border border-gray-800 bg-surface hover:bg-gray-800 text-gray-300 transition-colors text-sm font-medium">
                    <Upload size={16} className="text-gray-400" />
                    <span>Upload File</span>
                </button>
            </div>
        </aside>
    );
};

export default EditorSidebar;
