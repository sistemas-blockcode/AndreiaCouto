// pages/api/courses/[courseId]/lessons/[lessonId]/video.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export const config = {
  api: {
    responseLimit: false, // Remove o limite de resposta
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { lessonId } = req.query;

  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId as string) },
      select: { videoData: true },
    });

    if (!lesson || !lesson.videoData) {
      return res.status(404).json({ error: 'Vídeo não encontrado.' });
    }

    const videoBuffer = Buffer.from(lesson.videoData);

    // Suporte para Range Requests
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoBuffer.length - 1;

      res.status(206); // Partial Content
      res.setHeader("Content-Range", `bytes ${start}-${end}/${videoBuffer.length}`);
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Content-Length", end - start + 1);
      res.setHeader("Content-Type", "video/mp4");

      res.send(videoBuffer.slice(start, end + 1));
    } else {
      // Retorna o vídeo completo se não houver Range Header
      res.setHeader("Content-Length", videoBuffer.length);
      res.setHeader("Content-Type", "video/mp4");
      res.send(videoBuffer);
    }
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error);
    res.status(500).json({ error: 'Erro ao buscar vídeo' });
  }
}
