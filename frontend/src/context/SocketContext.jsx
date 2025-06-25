import { useContext } from 'react';
import { createContext, useEffect, useRef, useState } from 'react'

const SocketContext = createContext();

export const SocketProvider = ({children}) => {

    const socketRef = useRef(null);
    // eslint-disable-next-line no-unused-vars
    const [isConnected, setIsConnected] = useState(false);
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const ws = new WebSocket(import.meta.env.VITE_BACKEND_URL);

        socketRef.current = ws;

        ws.onopen= () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if(message.type === "online-users"){
                    console.log("Online Users : ", message.online);
                    setOnlineUsers(message.online);
                }
            } catch (error) {
                console.error("WebSocket parsing error:", error);
            }
        }

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
   <SocketContext.Provider value={{socket : socketRef.current, onlineUsers}}>
        {children}
   </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);