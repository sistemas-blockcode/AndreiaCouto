import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Desativa o bodyParser para usar `formidable`
  },
};

// Função auxiliar para processar o upload usando `formidable`
const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = new formidable.IncomingForm({
    maxTotalFileSize: 500 * 1024 * 1024, // Limite de 500MB
    multiples: false,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
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

      // Verificação do formato do arquivo de vídeo
      if (!(videoFile as formidable.File).mimetype?.startsWith('video/')) {
        return res.status(400).json({ error: 'Tipo de arquivo inválido. Apenas arquivos de vídeo são permitidos.' });
      }

      // Lê o arquivo de vídeo e converte para buffer
      const videoData = await fs.promises.readFile((videoFile as formidable.File).filepath);

      // Validação do ID do curso antes de criar a aula
      const courseId = parseInt(id as string);
      const courseExists = await prisma.course.findUnique({
        where: { id: courseId },
      });
      if (!courseExists) {
        return res.status(404).json({ error: 'Curso não encontrado.' });
      }

      // Criação da nova aula no banco de dados, incluindo o vídeo como BLOB
      const newLesson = await prisma.lesson.create({
        data: {
          title,
          thumbnail,
          videoData, // Salva o vídeo como BLOB
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
