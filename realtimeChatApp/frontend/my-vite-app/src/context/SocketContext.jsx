import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { serverUrl } from "../main";

// ✅ Export SocketContext for use in App.jsx
export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { userData } = useSelector((state) => state.user);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (userData) {
      const socketInstance = io(serverUrl, {
        auth: { userId: userData._id },
      });

      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
        setSocket(null);
      };
    }
  }, [userData]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
