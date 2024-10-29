import { useState, useEffect } from 'react';
import { User, CloseSquare, Eye, EyeSlash } from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';
import InputMask from 'react-input-mask';

interface Course {
  id: number;
  title: string;
}

export default function ModalAdicionarAluno({ onClose }: { onClose: () => void }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const { toast } = useToast();

  const handleAddStudent = async () => {
    if (!fullName || !email || !selectedCourse || !password || !phone) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/students/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phone,
          courseId: selectedCourse,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Sucesso!',
          description: 'Aluno adicionado com sucesso.',
          variant: 'success',
        });
        onClose();
      } else {
        toast({
          title: 'Erro ao adicionar aluno',
          description: data.message || 'Erro ao adicionar aluno.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar aluno:', error);
      toast({
        title: 'Erro no servidor',
        description: 'Erro ao adicionar aluno, tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses/getCourses');
        const data = await response.json();

        if (response.ok) {
          setCourses(data);
        } else {
          toast({
            title: 'Erro ao buscar cursos',
            description: data.message || 'Erro ao buscar cursos',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Erro ao buscar cursos:', error);
        toast({
          title: 'Erro no servidor',
          description: 'Erro ao buscar cursos, tente novamente mais tarde.',
          variant: 'destructive',
        });
      }
    };

    fetchCourses();
  }, [toast]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="relative bg-white rounded-lg p-6 shadow-md w-full max-w-lg">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition">
          <CloseSquare size="24" />
        </button>

        <h2 className="text-xl font-semibold mb-4">Adicionar Novo Aluno</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Nome Completo</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Digite o nome completo"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeAgua"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Telefone</label>
          <InputMask
            mask="(99) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(00) 00000-0000"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeAgua"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite o email"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeAgua"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Curso</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeAgua"
          >
            <option value="" disabled>
              Selecione o curso
            </option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700 font-semibold mb-2">Senha</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha"
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeAgua"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeSlash size="20" variant="Bold" /> : <Eye size="20" />}
          </button>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleAddStudent}
            className="bg-verde text-white rounded-lg px-4 py-2 hover:bg-verdeAgua transition"
            disabled={loading}
          >
            {loading ? 'Adicionando...' : 'Adicionar Aluno'}
          </button>
        </div>
      </div>
    </div>
  );
}
