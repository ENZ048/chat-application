import { useContext } from 'react';
import { createContext, useEffect, useRef, useState } from 'react'

const SocketContext = createContext();

export const SocketProvider = ({children}) => {

    const socketRef = useRef(null);
    // eslint-disable-next-line no-unused-vars
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const ws = new WebSocket(import.meta.env.VITE_BACKEND_URL);

        socketRef.current = ws;

        ws.onopen= () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket');
            setIsConnected(false);
        };

        ws.onerror = (err) => {
            console.log("WebSocket Error : " , err)
        }

        return () => ws.close();

    }, []);

  return (
   <SocketContext.Provider value={socketRef.current}>
        {children}
   </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);