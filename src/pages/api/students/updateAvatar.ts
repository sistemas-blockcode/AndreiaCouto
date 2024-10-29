import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { studentId, avatarUrl } = req.body;

  try {
    const updatedStudent = await prisma.user.update({
      where: { id: studentId },
      data: { avatarUrl },
    });

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Erro ao atualizar a foto de perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar a foto de perfil' });
  }
}
