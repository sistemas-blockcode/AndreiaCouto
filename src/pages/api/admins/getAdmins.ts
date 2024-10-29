// pages/api/admins/getAdmins.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN',
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        phone: true,
        taughtCourses: {
          select: {
            title: true,
          },
        },
      },
    });

    return res.status(200).json(admins);
  } catch (error) {
    console.error('Erro ao buscar administradores:', error);
    return res.status(500).json({ message: 'Erro ao buscar administradores' });
  }
}
