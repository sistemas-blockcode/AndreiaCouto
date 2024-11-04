import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lessonId } = req.query;

  if (req.method === 'GET') {
    try {
      const lesson = await prisma.lesson.findUnique({
        where: { id: parseInt(lessonId as string) },
        select: { videoData: true },
      });

      if (!lesson || !lesson.videoData) {
        return res.status(404).json({ error: 'Vídeo não encontrado.' });
      }

      res.setHeader('Content-Type', 'video/mp4'); // Ajuste o tipo de conteúdo conforme o tipo de vídeo
      res.send(lesson.videoData);
    } catch (error) {
      console.error('Erro ao buscar vídeo:', error);
      res.status(500).json({ error: 'Erro ao buscar vídeo' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
