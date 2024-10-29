import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';

interface SocketServer extends HTTPServer {
  io?: SocketIOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const socket = res.socket as SocketWithIO;

  if (!socket.server.io) {
    const httpServer: HTTPServer = socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    socket.server.io = io;

    io.on('connection', (socket) => {
      console.log(`Usuário conectado: ${socket.id}`);

      socket.on('sendMessage', ({ chatId, message, senderId }) => {
        io.to(chatId).emit('receiveMessage', { message, senderId });
      });

      socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`Usuário ${socket.id} entrou no chat ${chatId}`);
      });

      socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`);
      });
    });
  }

  res.end();
}
