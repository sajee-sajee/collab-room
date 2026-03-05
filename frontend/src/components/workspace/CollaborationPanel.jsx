import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, ListTodo, SendHorizontal, MoreHorizontal, Plus } from 'lucide-react';

const CollaborationPanel = ({ socket, roomId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef(null);

    // Auto-scroll chat to bottom
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // Socket listeners integrated from the old Chat component
    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on('user_joined', ({ username }) => {
            setMessages((prev) => [...prev, {
                system: true,
                text: `${username} joined the room`,
                timestamp: new Date()
            }]);
        });

        socket.on('room_state', (state) => {
            if (state.messages) {
                setMessages(state.messages);
            }
        });

        return () => {
            socket.off('receive_message');
            socket.off('user_joined');
            socket.off('room_state');
        };
    }, [socket]);

    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket) {
            socket.emit('send_message', {
                roomId,
                username: currentUser?.username || 'Guest',
                text: newMessage
            });
            setNewMessage('');
        }
    };

    return (
        <aside className="w-80 bg-background border-l border-gray-800 h-full flex flex-col shrink-0 hidden lg:flex">
            {/* CHAT SECTION */}
            <div className="flex-1 flex flex-col min-h-0 border-b border-gray-800">
                <div className="h-[40px] flex items-center justify-between px-4 border-b border-gray-800 bg-surface shrink-0">
                    <div className="flex items-center space-x-2 text-gray-200 font-semibold text-sm">
                        <MessageSquare size={16} className="text-primary" />
                        <span>Team Chat</span>
                    </div>
                    {/* Hardcoded 3 Active matching the screenshot */}
                    <span className="text-[10px] font-bold bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase tracking-wider">3 Active</span>
                </div>

                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                    {messages.map((msg, index) => {
                        const isSelf = msg.username === currentUser?.username;

                        if (msg.system) {
                            return (
                                <div key={index} className="flex justify-center my-4">
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold bg-gray-900/50 px-3 py-1 rounded-full border border-gray-800/50">
                                        {msg.text}
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <div key={index} className={`flex items-start space-x-3 ${isSelf ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                <div className="w-8 h-8 rounded-full bg-surface border border-gray-700 shrink-0 flex items-center justify-center text-xs font-bold text-gray-300 shadow-sm mt-1 overflow-hidden">
                                    {isSelf ? (
                                        <div className="w-full h-full bg-gradient-to-tr from-orange-400 to-amber-200 flex items-center justify-center text-orange-900 leading-none">
                                            {msg.username?.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-tr from-indigo-400 to-purple-500 flex items-center justify-center text-white leading-none">
                                            {msg.username?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                    )}
                                </div>
                                <div className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-baseline space-x-2 mb-1">
                                        <span className="text-xs font-bold text-gray-200">{isSelf ? 'You' : msg.username}</span>
                                        <span className="text-[10px] text-gray-600">
                                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                                        </span>
                                    </div>
                                    <div className={`text-sm px-4 py-2.5 rounded-2xl max-w-[220px] break-words ${isSelf ? 'bg-primary text-white rounded-tr-sm' : 'bg-surface border border-gray-800 text-gray-300 rounded-tl-sm'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-4 shrink-0 bg-background">
                    <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full bg-surface border border-gray-800 text-gray-200 rounded-lg pl-4 pr-10 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-gray-600 text-sm shadow-inner"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
                        >
                            <SendHorizontal size={18} />
                        </button>
                    </form>
                </div>
            </div>

            {/* TASKS SECTION (Static) */}
            <div className="h-[35%] flex flex-col min-h-0 bg-background">
                <div className="h-[40px] flex items-center px-4 shrink-0 bg-surface border-b border-gray-800">
                    <div className="flex items-center space-x-2 text-gray-200 font-semibold text-sm">
                        <ListTodo size={16} className="text-yellow-500" />
                        <span>Tasks</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div className="bg-surface border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded uppercase tracking-wider">In Progress</span>
                            <span className="text-[10px] text-gray-500 mt-0.5">Due Tomorrow</span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-200 mb-3 group-hover:text-primary transition-colors">Implement code linting</h4>
                        <div className="flex justify-between items-center">
                            <div className="w-6 h-6 rounded-full bg-orange-300 flex items-center justify-center text-[10px] font-bold text-orange-900 border border-background">
                                S
                            </div>
                            <MoreHorizontal size={16} className="text-gray-600 group-hover:text-gray-400" />
                        </div>
                    </div>

                    <div className="bg-background border border-gray-800 rounded-xl p-4 opacity-75">
                        <div className="flex items-center mb-2">
                            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded uppercase tracking-wider">Done</span>
                        </div>
                        <h4 className="text-sm font-semibold text-gray-500 mb-3 line-through">Setup room collaboration</h4>
                        <div className="flex justify-between items-center">
                            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-300 border border-background">
                                A
                            </div>
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-center space-x-2 py-3 border border-dashed border-gray-700 hover:border-gray-500 text-gray-500 hover:text-gray-300 rounded-xl transition-colors text-xs font-semibold">
                        <Plus size={14} />
                        <span>Add New Task</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default CollaborationPanel;
