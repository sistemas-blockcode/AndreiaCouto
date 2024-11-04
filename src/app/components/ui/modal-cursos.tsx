import { useState, useEffect } from 'react';
import { User, Camera, CloseSquare } from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';

interface Administrator {
  id: number;
  name: string;
}

export default function ModalCursos({ onClose }: { onClose: () => void }) {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [loading, setLoading] = useState(false);
  const [administrators, setAdministrators] = useState<Administrator[]>([]); // Tipo definido aqui

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

  const handleCreateCourse = async () => {
    if (!courseName || !courseDescription || !selectedInstructor) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch('/api/courses/createCourses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: courseName,
          description: courseDescription,
          instructorId: selectedInstructor,
          thumbnail, // O thumbnail será enviado como null ou uma string caso seja selecionado
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        toast({
          title: 'Sucesso!',
          description: 'Curso criado com sucesso.',
          variant: 'success',
        });
        onClose();
      } else {
        toast({
          title: 'Erro ao criar curso',
          description: data.message || 'Erro ao criar curso',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao criar curso:', error);
      toast({
        title: 'Erro no servidor',
        description: 'Erro ao criar curso, tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };  

  useEffect(() => {
    const fetchAdministrators = async () => {
      try {
        const response = await fetch('/api/users/admins');
        const data = await response.json();
        setAdministrators(data);
      } catch (error) {
        console.error('Erro ao buscar administradores:', error);
      }
    };

    fetchAdministrators();
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="relative bg-white rounded-lg p-6 shadow-md w-full max-w-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition">
          <CloseSquare size="24" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Curso</h2>

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
            placeholder="Digite o nome do curso"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeAgua"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Descrição do Curso</label>
          <input
            type="text"
            value={courseDescription}
            onChange={(e) => setCourseDescription(e.target.value)}
            placeholder="Digite a descrição do curso"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeAgua"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Instrutor</label>
          <select
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeAgua"
          >
            <option value="" disabled>
              Selecione o instrutor
            </option>
            {administrators.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreateCourse}
            className="bg-verde text-white rounded-lg px-4 py-2 hover:bg-verdeAgua transition"
            disabled={loading}
          >
            {loading ? 'Adicionando...' : 'Adicionar Curso'}
          </button>
        </div>
      </div>
    </div>
  );
}
