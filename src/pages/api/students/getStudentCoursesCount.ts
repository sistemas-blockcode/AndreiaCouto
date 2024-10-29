import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Iniciando API /getStudentCoursesCount");
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { studentId } = req.query;

  console.log("studentId recebido:", studentId);

  if (!studentId) {
    console.log("ID do aluno não fornecido");
    return res.status(400).json({ message: 'ID do aluno é necessário.' });
  }

  try {
    const student = await prisma.user.findUnique({
      where: { id: Number(studentId) },
      include: { courses: true },
    });

    if (!student) {
      console.log("Aluno não encontrado com ID:", studentId);
      return res.status(404).json({ message: 'Aluno não encontrado.' });
    }

    console.log("Cursos do aluno:", student.courses);
    res.status(200).json({ coursesCount: student.courses.length });
  } catch (error) {
    console.error('Erro ao buscar contagem de cursos:', error);
    res.status(500).json({ message: 'Erro ao buscar contagem de cursos do aluno.' });
  }
}
