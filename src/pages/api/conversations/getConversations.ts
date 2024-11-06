// pages/api/conversations/getConversations.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'ID do aluno é necessário.' });
  }

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participantAId: Number(userId) },
          { participantBId: Number(userId) },
        ],
      },
      include: {
        participantA: { select: { id: true, name: true, avatarUrl: true } },
        participantB: { select: { id: true, name: true, avatarUrl: true } },
        messages: {
          select: { text: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 1, // Apenas a última mensagem como prévia
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    res.status(500).json({ message: 'Erro ao buscar conversas.' });
  }
}
