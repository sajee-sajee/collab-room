import { createContext, useState, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { API_URL, getToken, apiFetch } from '../lib/api';

const SocketContext = createContext();
export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);
    useEffect(() => () => socket?.disconnect(), [socket]);
    const connectSocket = () => {
        if (!socket) setSocket(io(API_URL, { auth: { token: getToken() } }));
    };
    const login = (data) => {
        socket?.disconnect();
        sessionStorage.setItem('collab-token', data.token);
        setUser(data.user);
        setSocket(io(API_URL, { auth: { token: data.token } }));
    };
    const logout = async () => {
        try { await apiFetch('/api/auth/logout', { method: 'POST' }); }
        finally {
            sessionStorage.removeItem('collab-token');
            socket?.disconnect();
            setSocket(null);
            setUser(null);
        }
    };
    return <SocketContext.Provider value={{ socket, connectSocket, user, setUser, login, logout }}>{children}</SocketContext.Provider>;
};
export const useSocket = () => useContext(SocketContext);
