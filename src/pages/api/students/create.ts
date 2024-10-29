import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { fullName, email, courseId, password, phone } = req.body;

  
  if (!fullName || !email || !courseId || !password || !phone) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe com este email' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
        phone,
        role: 'ALUNO',
        courses: {
          connect: {
            id: parseInt(courseId),
          },
        },
      },
    });

    return res.status(201).json({
      message: 'Aluno adicionado com sucesso!',
      user: newUser,
    });
  } catch (error) {
    console.error('Erro ao adicionar aluno:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}
