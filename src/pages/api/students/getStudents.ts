import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const students = await prisma.user.findMany({
      where: {
        role: 'ALUNO',
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        phone: true,
        courses: {
          select: {
            title: true,
          },
        },
      },
    });

    return res.status(200).json(students);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    return res.status(500).json({ message: 'Erro ao buscar alunos' });
  }
}
