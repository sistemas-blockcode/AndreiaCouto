import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { studentId } = req.query;

  if (!studentId || Array.isArray(studentId)) {
    return res.status(400).json({ message: 'Invalid studentId' });
  }

  try {
    const totalWatchTime = await prisma.lessonProgress.aggregate({
      where: { studentId: parseInt(studentId, 10) },
      _sum: { timeWatched: true },
    });

    // Retorna o tempo total assistido em segundos
    res.status(200).json({ totalWatchTime: totalWatchTime._sum.timeWatched || 0 });
  } catch (error) {
    console.error('Error fetching watch time:', error);
    res.status(500).json({ message: 'Failed to fetch watch time' });
  }
}
