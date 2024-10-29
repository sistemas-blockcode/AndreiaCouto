import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { userId, name } = req.body;

 
  if (!userId || !name || name.trim() === '') {
    return res.status(400).json({ message: 'ID do usuário e nome válido são necessários.' });
  }

  try {
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
    });

    res.status(200).json({ message: 'Nome atualizado com sucesso!', user: updatedUser });
  } catch (error) {
    console.error('Erro ao atualizar o nome:', error);
    res.status(500).json({ message: 'Erro ao atualizar o nome do usuário.' });
  }
}
