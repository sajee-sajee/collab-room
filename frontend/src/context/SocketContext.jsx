import React, { createContext, useState, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);

    const connectSocket = () => {
        if (!socket) {
            const newSocket = io('http://localhost:5001');
            setSocket(newSocket);
        }
    };

    return (
        <SocketContext.Provider value={{ socket, connectSocket, user, setUser }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
