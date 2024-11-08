// pages/api/students/deleteStudents.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: 'ID do aluno é necessário.' });
    }

    try {
      const id = Number(studentId);

      // Exclui referências manuais antes de excluir o usuário
      await prisma.conversation.deleteMany({
        where: { OR: [{ participantAId: id }, { participantBId: id }] },
      });
      await prisma.chat.deleteMany({
        where: { OR: [{ senderId: id }, { receiverId: id }] },
      });
      await prisma.message.deleteMany({
        where: { senderId: id },
      });
      await prisma.lessonProgress.deleteMany({
        where: { studentId: id },
      });

      // Agora pode excluir o usuário
      const student = await prisma.user.delete({
        where: { id },
      });

      res.status(200).json({ message: 'Aluno deletado com sucesso!', student });
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      res.status(500).json({ message: 'Erro ao deletar aluno.' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
