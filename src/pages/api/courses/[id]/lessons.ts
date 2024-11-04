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

      // Verificação do formato do arquivo de vídeo (exemplo: apenas arquivos .mp4)
      if (!videoFile.mimetype?.startsWith('video/')) {
        return res.status(400).json({ error: 'Tipo de arquivo inválido. Apenas arquivos de vídeo são permitidos.' });
      }

      // Caminho para salvar o arquivo de vídeo em `public/uploads`
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        await fs.promises.mkdir(uploadDir, { recursive: true });
      }

      // Define o caminho completo para salvar o vídeo
      const videoFilePath = path.join(uploadDir, videoFile.newFilename);

      // Move o arquivo para `public/uploads` usando o método assíncrono
      await fs.promises.rename(videoFile.filepath, videoFilePath);

      // Define o `videoUrl` que será salvo no banco de dados
      const videoUrl = `/uploads/${videoFile.newFilename}`;

      // Validação do ID do curso antes de criar a aula
      const courseId = parseInt(id as string);
      const courseExists = await prisma.course.findUnique({
        where: { id: courseId },
      });
      if (!courseExists) {
        return res.status(404).json({ error: 'Curso não encontrado.' });
      }

      // Criação da nova aula no banco de dados
      const newLesson = await prisma.lesson.create({
        data: {
          title,
          videoUrl, // URL do vídeo para exibição
          thumbnail,
          courseId,
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