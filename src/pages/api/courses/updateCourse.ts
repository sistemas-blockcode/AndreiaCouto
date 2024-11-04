// /api/courses/updateCourse.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { courseId, title, thumbnail } = req.body;

  if (!courseId || !title) {
    return res.status(400).json({ message: 'ID e título do curso são obrigatórios!' });
  }

  try {
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        thumbnail: thumbnail || null, // Se `thumbnail` for `null`, ele é removido
      },
    });

    res.status(200).json({ message: 'Curso atualizado com sucesso!', updatedCourse });
  } catch (error) {
    console.error('Erro ao atualizar curso:', error);
    res.status(500).json({ message: 'Erro ao atualizar curso' });
  }
}
