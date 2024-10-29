// pages/api/auth/forgot-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const { email } = req.body;

   
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

   
    await prisma.verificationCode.upsert({
      where: { email },
      update: { code: verificationCode, expiresAt },
      create: { email, code: verificationCode, expiresAt },
    });

    
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de Verificação',
      text: `Seu código de verificação é ${verificationCode}`,
    });

    return res.status(200).json({ message: 'Código de verificação enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao processar o pedido:', error);
    return res.status(500).json({ message: 'Erro no servidor ao enviar e-mail' });
  }
}
