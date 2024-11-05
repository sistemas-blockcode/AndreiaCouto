// pages/api/courses/[id]/deleteLesson.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { lessonId } = req.query;

    if (!lessonId) {
      return res.status(400).json({ error: 'O ID da lição é necessário.' });
    }

    try {
      await prisma.lesson.delete({
        where: { id: parseInt(lessonId as string, 10) },
      });

      console.log(`Lição com ID ${lessonId} deletada com sucesso.`);
      res.status(200).json({ message: 'Lição deletada com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar lição:', error);
      res.status(500).json({ error: 'Erro ao deletar lição' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
