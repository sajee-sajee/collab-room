import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

const Chat = ({ socket, roomId, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!socket) return;

        socket.on('receive_message', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        // Listen for users joining
        socket.on('user_joined', ({ username }) => {
            setMessages((prev) => [...prev, {
                system: true,
                text: `${username} joined the room`,
                timestamp: new Date()
            }]);
        });

        // Initialize state
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

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message.trim() && socket) {
            socket.emit('send_message', {
                roomId,
                username: currentUser.username,
                text: message
            });
            setMessage('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-900 border-l border-gray-800">
            <div className="p-4 border-b border-gray-800 bg-gray-950 flex items-center justify-between shadow-sm">
                <h2 className="text-lg font-semibold text-gray-200 tracking-wide">Room Chat</h2>
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs text-gray-400 font-medium">Live</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.system ? 'items-center my-4' : msg.username === currentUser?.username ? 'items-end' : 'items-start'}`}>
                        {msg.system ? (
                            <span className="text-xs text-gray-400 px-3 py-1 bg-gray-800/60 rounded-full font-medium tracking-wide">
                                {msg.text}
                            </span>
                        ) : (
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-sm ${msg.username === currentUser?.username ? 'bg-cyan-600/90 text-white rounded-tr-sm' : 'bg-gray-800/90 text-gray-200 rounded-tl-sm border border-gray-700/50'}`}>
                                <div className="flex items-center space-x-2 mb-1">
                                    <div className="text-[10px] font-bold tracking-wider opacity-80 uppercase">
                                        {msg.username === currentUser?.username ? 'You' : msg.username}
                                    </div>
                                    <span className="text-[9px] opacity-60">
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                    </span>
                                </div>
                                <div className="text-[15px] leading-relaxed break-words">{msg.text}</div>
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-gray-950 border-t border-gray-800">
                <div className="relative group">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-gray-900 text-gray-200 rounded-xl pl-4 pr-12 py-3.5 border border-gray-700 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all"
                    >
                        <Send size={18} className={message.trim() ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Chat;
