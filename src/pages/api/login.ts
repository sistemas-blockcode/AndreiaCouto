// login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      const redirectRoute = user.role === 'ADMIN' ? '/admin/dash' : '/painel';

      res.setHeader(
        'Set-Cookie',
        serialize('token', token, {
          httpOnly: true, 
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600, 
          path: '/', 
        })
      );

      return res.status(200).json({ redirectRoute, token }); // Token e rota de redirecionamento
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro no servidor' });
    }
  }

  return res.status(405).json({ message: 'Método não permitido' });
}
