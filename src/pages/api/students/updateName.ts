import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { studentId, name } = req.body;

  if (!studentId || !name) {
    return res.status(400).json({ message: 'ID do aluno e nome são necessários.' });
  }

  try {
    const updatedStudent = await prisma.user.update({
      where: { id: studentId },
      data: { name },
    });

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Erro ao atualizar o nome:', error);
    res.status(500).json({ message: 'Erro ao atualizar o nome do aluno.' });
  }
}
