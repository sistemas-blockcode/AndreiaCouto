import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ message: 'ID do aluno é necessário.' });
  }

  try {
    const updatedStudent = await prisma.user.update({
      where: { id: studentId },
      data: { avatarUrl: null },
    });

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Erro ao remover a foto de perfil:', error);
    res.status(500).json({ message: 'Erro ao remover a foto de perfil do aluno.' });
  }
}
