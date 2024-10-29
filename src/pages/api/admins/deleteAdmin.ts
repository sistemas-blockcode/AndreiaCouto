import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { adminId } = req.query;

    if (!adminId) {
      return res.status(400).json({ message: 'ID do administrador é necessário.' });
    }

    try {
      const admin = await prisma.user.delete({
        where: { id: Number(adminId) },
      });

      res.status(200).json({ message: 'Administrador deletado com sucesso!', admin });
    } catch (error) {
      console.error('Erro ao deletar administrador:', error);
      res.status(500).json({ message: 'Erro ao deletar administrador.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
