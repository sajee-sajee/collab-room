import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import Editor from '../components/Editor';
import Terminal from '../components/Terminal';
import { Code2, Settings } from 'lucide-react';

// New Architecture Components
import WorkspaceHeader from '../components/workspace/WorkspaceHeader';
import EditorSidebar from '../components/workspace/EditorSidebar';
import CollaborationPanel from '../components/workspace/CollaborationPanel';
import StatusBar from '../components/workspace/StatusBar';

const Room = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { socket, user } = useSocket();

    const [code, setCode] = useState('// React Component initialization placeholder\nimport React from \'react\';\n\nconst App = () => {\n  return <div>Initialize...</div>;\n};\n\nexport default App;');
    const [language, setLanguage] = useState('javascript');

    useEffect(() => {
        if (!user || !socket) {
            navigate('/');
            return;
        }

        socket.emit('join_room', { roomId, username: user.username });

        socket.on('room_state', (state) => {
            if (state.code) setCode(state.code);
            if (state.language) setLanguage(state.language);
        });

        socket.on('language_update', (newLang) => {
            setLanguage(newLang);
        });

        return () => {
            socket.off('room_state');
            socket.off('language_update');
        };
    }, [roomId, user, socket, navigate]);

    if (!user) return null;

    // We can simulate active users using the current user + a dummy for UI richness
    const activeUsers = [user, { username: 'Sarah' }];

    return (
        <div className="flex flex-col h-screen bg-background text-gray-100 overflow-hidden font-sans">

            <WorkspaceHeader projectName="Fintech_Dashboard_v2" activeUsers={activeUsers} />

            <div className="flex flex-1 min-h-0">
                <EditorSidebar />

                {/* Center Column: Editor and Terminal */}
                <main className="flex-1 flex flex-col min-w-0 bg-[#0F111A]">

                    {/* Fake Editor Tabs */}
                    <div className="h-[40px] flex items-center bg-surface border-b border-gray-800 shrink-0 select-none">
                        <div className="flex items-center h-full px-4 border-r border-gray-800 bg-[#0F111A] text-gray-200 border-t-2 border-t-primary cursor-pointer text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            Editor.tsx
                            <span className="ml-3 text-gray-500 hover:text-white">&times;</span>
                        </div>
                        <div className="flex items-center h-full px-4 border-r border-gray-800 text-gray-500 hover:bg-gray-800/50 cursor-pointer text-sm font-medium transition-colors">
                            <span className="text-[10px] font-black text-cyan-500 mr-2 tracking-tighter">CSS</span>
                            styles.css
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 relative">
                        {/* Editor fills this space */}
                        <Editor
                            code={code}
                            setCode={setCode}
                            language={language} /* Let's keep language dropdown hidden for now, just auto format */
                            socket={socket}
                            roomId={roomId}
                        />
                    </div>

                    {/* Terminal at bottom of middle column */}
                    <Terminal code={code} language={language} />

                </main>

                <CollaborationPanel socket={socket} roomId={roomId} currentUser={user} />
            </div>

            <StatusBar />
        </div>
    );
};

export default Room;
