import formidable, { File } from 'formidable';
import { NextApiRequest } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

export function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({
    multiples: true,
    allowEmptyFiles: false,
    maxFileSize: 200 * 1024 * 1024,
    maxFieldsSize: 20 * 1024 * 1024, 
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Erro ao fazer parse do formulário:', err); 
        reject(err);
      } else {
        resolve({ fields, files });
      }
    });
  });
}
