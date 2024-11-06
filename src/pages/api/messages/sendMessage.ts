// pages/api/conversations/sendMessage.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { conversationId, senderId, text } = req.body;

  if (!conversationId || !senderId || !text) {
    return res.status(400).json({ message: 'Dados insuficientes para enviar a mensagem.' });
  }

  try {
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

    res.status(201).json({
      id: message.id,
      sender: message.sender.name,
      text: message.text,
      createdAt: message.createdAt.toISOString(),
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ message: 'Erro ao enviar mensagem.' });
  }
}
