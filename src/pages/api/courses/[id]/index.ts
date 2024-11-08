import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const course = await prisma.course.findUnique({
        where: { id: parseInt(id as string) },
        include: {
          instructor: { select: { name: true } },
          lessons: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
            },
          },
        },
      });

      if (!course) {
        return res.status(404).json({ error: 'Curso não encontrado' });
      }

      // Construa a URL do vídeo para cada aula
      const lessonsWithUrls = course.lessons.map((lesson) => ({
        ...lesson,
        videoUrl: `/api/courses/${course.id}/lessons/${lesson.id}/video`,
      }));

      res.status(200).json({ ...course, lessons: lessonsWithUrls });
    } catch (error) {
      console.error('Erro ao carregar detalhes do curso:', error);
      res.status(500).json({ error: 'Erro ao carregar detalhes do curso' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
