import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const courses = await prisma.course.findMany({
      where: { students: { some: { id: parseInt(id as string) } } },
      select: {
        id: true,
        title: true,
        thumbnail: true,
        instructor: {
          select: { name: true },
        },
      },
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos do usuário:', error);
    res.status(500).json({ error: 'Erro ao buscar cursos do usuário' });
  }
}
