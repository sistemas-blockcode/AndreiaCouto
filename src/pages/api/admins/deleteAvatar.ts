import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'ID do usuário é necessário.' });
  }

  try {
    // Atualiza o avatarUrl para null
    const user = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
    });

    res.status(200).json({ message: 'Foto de perfil removida com sucesso.', user });
  } catch (error) {
    console.error('Erro ao remover foto de perfil:', error);
    res.status(500).json({ message: 'Erro ao remover foto de perfil.' });
  }
}
