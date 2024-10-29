import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { participantAId, participantBId } = req.body;
  console.log("API received participantAId:", participantAId, "participantBId:", participantBId);

  if (!participantAId || !participantBId) {
    return res.status(400).json({ message: 'IDs dos participantes são necessários' });
  }

  try {
    const [participantA, participantB] = await Promise.all([
      prisma.user.findUnique({ where: { id: participantAId } }),
      prisma.user.findUnique({ where: { id: participantBId } })
    ]);

    if (!participantA || !participantB) {
      console.error("Participants not found");
      return res.status(404).json({ message: 'Um ou ambos os usuários não foram encontrados' });
    }

    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { participantAId: participantAId, participantBId: participantBId },
          { participantAId: participantBId, participantBId: participantAId },
        ],
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participantAId,
          participantBId,
        },
      });
      console.log("New conversation created:", conversation);
    } else {
      console.log("Existing conversation found:", conversation);
    }

    return res.status(200).json(conversation);
  } catch (error) {
    console.error('Erro ao criar ou buscar conversa:', error);
    return res.status(500).json({ message: 'Erro ao criar ou buscar conversa' });
  }
}
