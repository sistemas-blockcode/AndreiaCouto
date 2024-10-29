import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io({
      path: '/api/socket',
    });

    setSocket(socketInstance);
    console.log('Socket conectado:', socketInstance.id);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return socket;
}
