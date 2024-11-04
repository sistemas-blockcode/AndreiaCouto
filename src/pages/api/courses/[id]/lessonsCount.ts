import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Método ${req.method} não permitido`);
  }

  try {
    const lessonsCount = await prisma.lesson.count({
      where: {
        courseId: parseInt(id as string, 10),
      },
    });

    res.status(200).json({ lessonsCount });
  } catch (error) {
    console.error('Erro ao contar as aulas:', error);
    res.status(500).json({ error: 'Erro ao contar as aulas' });
  }
}
