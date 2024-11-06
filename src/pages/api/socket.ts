// pages/api/socket.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';
import { prisma } from '@/lib/prisma';

interface SocketServer extends HTTPServer {
  io?: SocketIOServer;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

      socket.on('joinChat', (chatId) => {
        socket.join(chatId);
        console.log(`Usuário ${socket.id} entrou no chat ${chatId}`);
      });

      socket.on('sendMessage', async ({ conversationId, senderId, text }) => {
        try {
          // Salva a mensagem no banco de dados
          const message = await prisma.message.create({
            data: {
              text,
              senderId,
              conversationId,
            },
            include: {
              sender: true,
            },
          });

          // Emite a mensagem para todos os usuários conectados ao chat
          io.to(conversationId.toString()).emit('receiveMessage', {
            id: message.id,
            sender: message.sender.name,
            text: message.text,
            createdAt: message.createdAt.toISOString(),
          });
        } catch (error) {
          console.error("Erro ao enviar mensagem via socket:", error);
        }
      });

      socket.on('disconnect', () => {
        console.log(`Usuário desconectado: ${socket.id}`);
      });
    });
  }

  res.end();
}
