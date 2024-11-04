import { useState } from 'react';
import { User, Camera, CloseSquare } from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';

interface EditCourseModalProps {
  courseId: number;
  initialTitle: string;
  initialThumbnail: string | null;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditCourseModal({
  courseId,
  initialTitle,
  initialThumbnail,
  onClose,
  onUpdate
}: EditCourseModalProps) {
  const [thumbnail, setThumbnail] = useState<string | null>(initialThumbnail);
  const [courseName, setCourseName] = useState(initialTitle);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: 'Formato inválido',
        description: 'Por favor, selecione uma imagem no formato JPG ou PNG.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateCourse = async () => {
    if (!courseName) {
      toast({
        title: 'Campos obrigatórios',
        description: 'O nome do curso é obrigatório.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/courses/updateCourse`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          title: courseName,
          thumbnail,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Sucesso!',
          description: 'Curso atualizado com sucesso.',
          variant: 'success',
        });
        onUpdate();
        onClose();
      } else {
        toast({
          title: 'Erro ao atualizar curso',
          description: 'Houve um problema ao atualizar o curso.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
      toast({
        title: 'Erro no servidor',
        description: 'Erro ao atualizar o curso, tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="relative bg-white rounded-lg p-6 shadow-md w-full max-w-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition">
          <CloseSquare size="24" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Editar Curso</h2>

        <div className="flex justify-center mb-4">
          <div className="relative">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Thumbnail do Curso"
                className="w-32 h-32 object-cover rounded-full shadow-md"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center rounded-full">
                <User size="40" color="#9CA3AF" />
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-verde rounded-full p-2 cursor-pointer">
              <Camera size="20" color="white" />
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Nome do Curso</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeAgua"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpdateCourse}
            className="bg-verde text-white rounded-lg px-4 py-2 hover:bg-verdeAgua transition"
            disabled={loading}
          >
            {loading ? 'Atualizando...' : 'Atualizar Curso'}
          </button>
        </div>
      </div>
    </div>
  );
}
