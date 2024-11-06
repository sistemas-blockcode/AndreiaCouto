// pages/api/conversations/[conversationId]/messages.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { conversationId } = req.query;

  if (!conversationId) {
    return res.status(400).json({ message: 'ID da conversa é necessário.' });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: Number(conversationId) },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { name: true },
        },
      },
    });

    // Formata as mensagens para incluir o nome do remetente
    const formattedMessages = messages.map((message) => ({
      id: message.id,
      sender: message.sender.name,
      text: message.text,
      createdAt: message.createdAt.toISOString(),
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ message: 'Erro ao buscar mensagens.' });
  }
}
