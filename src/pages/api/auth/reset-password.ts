// pages/api/auth/reset-password.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { email, newPassword, code } = req.body;

  
  if (!email || !newPassword || !code) {
    console.log('Faltando dados na solicitação:', { email, newPassword, code });
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    console.log("Processando redefinição de senha para o email:", email);
    console.log("Código fornecido:", code);

    
    const verification = await prisma.verificationCode.findUnique({
      where: { email },
    });

    if (!verification || verification.code !== code) {
      console.log("Nenhum código de verificação encontrado para o email:", email);
      return res.status(400).json({ message: 'Código inválido ou expirado' });
    }

    
    const hashedPassword = await hash(newPassword, 10);
    console.log("Nova senha hasheada gerada.");

    
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    console.log("Senha redefinida com sucesso para o email:", email);

    
    await prisma.verificationCode.delete({ where: { email } });

    return res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
    return res.status(500).json({ message: 'Erro ao redefinir a senha' });
  }
}
