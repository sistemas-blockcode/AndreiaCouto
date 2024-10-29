// pages/api/auth/verify-code.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ message: 'E-mail e código são obrigatórios' });
  }

  try {
    
    const verification = await prisma.verificationCode.findUnique({
      where: { email },
    });

    if (!verification) {
      return res.status(400).json({ message: 'Código inválido ou expirado' });
    }

    
    if (new Date() > verification.expiresAt) {
      return res.status(400).json({ message: 'Código expirado.' });
    }

    
    if (verification.code === code) {
      
      return res.status(200).json({ message: 'Código verificado com sucesso!' });
    } else {
      return res.status(400).json({ message: 'Código inválido ou expirado' });
    }
  } catch (error) {
    console.error('Erro ao verificar o código:', error);
    return res.status(500).json({ message: 'Erro no servidor ao verificar o código.' });
  }
}
