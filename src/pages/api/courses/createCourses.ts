import { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '@/lib/prisma'; // Importa o cliente Prisma

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { title, description, instructorId, thumbnail } = req.body;


  if (!title || !description || !instructorId || !thumbnail) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }

  try {
    
    const course = await prisma.course.create({
      data: {
        title,
        description,
        instructorId: parseInt(instructorId), 
        lessons: {
          create: [], 
        },
      },
    });

    return res.status(201).json({ message: 'Curso criado com sucesso!', course });
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    return res.status(500).json({ message: 'Erro ao criar curso' });
  }
}
