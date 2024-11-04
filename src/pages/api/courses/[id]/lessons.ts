import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { parseForm } from '@/lib/parseForm';
import { File } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'POST') {
    try {
      const { fields, files } = await parseForm(req);

      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const thumbnail = Array.isArray(fields.thumbnail) ? fields.thumbnail[0] : fields.thumbnail;
      const videoFile = Array.isArray(files.video) ? files.video[0] : files.video;

      if (!title || !thumbnail || !videoFile) {
        return res.status(400).json({ error: 'Campos obrigatórios estão faltando.' });
      }

      // Caminho para salvar o arquivo de vídeo em `public/uploads`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const videoFilePath = path.join(uploadDir, videoFile.newFilename);
      fs.renameSync(videoFile.filepath, videoFilePath); // Move o arquivo para `public/uploads`

      // Define o `videoUrl` que será salvo no banco de dados
      const videoUrl = `/uploads/${videoFile.newFilename}`;

      // Criação da nova aula no banco de dados
      const newLesson = await prisma.lesson.create({
        data: {
          title,
          videoUrl, // URL do vídeo para exibição
          thumbnail,
          courseId: parseInt(id as string),
        },
      });

      res.status(201).json(newLesson);
    } catch (error) {
      console.error('Erro ao adicionar aula:', error);
      res.status(500).json({ error: 'Erro ao adicionar aula' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}
