import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import jwt, { JwtPayload } from 'jsonwebtoken';

const getUserFromToken = async (req: NextApiRequest) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { userId: number };
    
    if (!decoded.userId) throw new Error('Token não contém userId');

    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    return user;
  } catch (error) {
    console.error('Erro ao decodificar o token:', error);
    return null;
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const user = await getUserFromToken(req);
    if (!user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    res.status(200).json({ userId: user.id, name: user.name });
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
