import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            name: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
    });

    const formattedCourses = courses.map((course) => ({
      ...course,
      studentsCount: course._count.students,
    }));

    return res.status(200).json(formattedCourses);
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
    return res.status(500).json({ message: 'Erro ao buscar cursos' });
  }
}
