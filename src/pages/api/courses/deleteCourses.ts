import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ message: 'ID do curso é necessário.' });
    }

    try {
      const course = await prisma.course.delete({
        where: { id: Number(courseId) },
      });

      res.status(200).json({ message: 'Curso deletado com sucesso!', course });
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      res.status(500).json({ message: 'Erro ao deletar curso.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
