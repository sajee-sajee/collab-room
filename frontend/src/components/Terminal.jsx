import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';

const Terminal = ({ code, language }) => {
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [activeTab, setActiveTab] = useState('OUTPUT');

    const handleRunCode = async () => {
        if (!code.trim()) {
            setOutput('Error: No code to run.');
            setActiveTab('OUTPUT');
            return;
        }

        setIsRunning(true);
        setActiveTab('OUTPUT');
        setOutput('[System] Executing code inside Docker container...\n');

        try {
            const res = await fetch('http://localhost:5001/api/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code, language })
            });
            const data = await res.json();

            if (res.ok) {
                if (data.success) {
                    setOutput((prev) => prev + `[Output]\n${data.output}`);
                } else {
                    setOutput((prev) => prev + `[Execution Error]\n${data.error}`);
                }
            } else {
                setOutput((prev) => prev + `[Server Error]\n${data.error || 'Failed to execute code'}`);
            }
        } catch (error) {
            setOutput((prev) => prev + `[Network Error]\n${error.message}`);
        } finally {
            setIsRunning(false);
        }
    };

    const tabs = ['OUTPUT', 'DEBUG CONSOLE', 'TERMINAL'];

    return (
        <div className="flex flex-col h-64 bg-background border-t border-gray-800 shrink-0">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 bg-background border-b border-gray-800">
                <div className="flex items-center space-x-6 h-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-xs font-bold tracking-widest uppercase transition-colors relative h-full flex items-center ${activeTab === tab ? 'text-gray-200' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div>
                    <button
                        onClick={handleRunCode}
                        disabled={isRunning}
                        className={`flex items-center space-x-2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-all 
                             ${isRunning ? 'bg-brand-purple/50 text-white/70 cursor-not-allowed' : 'bg-brand-purple hover:bg-brand-purple/80 text-white shadow-md shadow-brand-purple/20'}`}
                    >
                        {isRunning ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} className="ml-0.5 fill-current" />}
                        <span>RUN CODE</span>
                    </button>
                </div>
            </div>

            {/* Terminal Content */}
            <div className="flex-1 p-4 overflow-y-auto font-mono text-[13px] text-gray-400 whitespace-pre-wrap tracking-wide leading-relaxed">
                {activeTab === 'OUTPUT' && (
                    output || <span className="text-gray-600 italic">Click "RUN CODE" to view execution output...</span>
                )}
                {activeTab === 'DEBUG CONSOLE' && (
                    <span className="text-gray-600 italic">No active debugging sessions.</span>
                )}
                {activeTab === 'TERMINAL' && (
                    <span className="text-gray-600 italic">Integrated terminal is read-only in this view.</span>
                )}
            </div>
        </div>
    );
};

export default Terminal;
