import { useState, useEffect } from 'react';
import { CloseSquare, SearchNormal1, User } from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/app/components/context/AuthContext';

type Student = {
  id: number;
  name: string;
  avatarUrl?: string | null;
};

interface ModalNovaConversaProps {
  onClose: () => void;
  onSelectConversation: (id: number) => void;
}

export default function ModalNovaConversa({ onClose, onSelectConversation }: ModalNovaConversaProps) {
  const { userId: loggedInUserId, loading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/admins/getAdmins');
        if (!response.ok) throw new Error('Erro ao buscar admins');
        
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error('Erro ao buscar admins:', error);
        toast({
          title: 'Erro ao buscar admins',
          description: 'Não foi possível carregar a lista de admins.',
          variant: 'destructive',
        });
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStartConversation = async (participantBId: number) => {
    if (loading) return;
    if (!loggedInUserId) {
      toast({
        title: 'Erro de autenticação',
        description: 'Usuário não está autenticado.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/conversations/createOrGetConversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          participantAId: loggedInUserId,
          participantBId,
        }),
      });

      if (response.ok) {
        const conversation = await response.json();
        onSelectConversation(conversation.id); // Atualiza a conversa no sidechat
        toast({
          title: 'Conversa iniciada!',
          description: `Conversa com o usuário ID: ${participantBId} foi iniciada.`,
          variant: 'success',
        });
        onClose();
      } else {
        throw new Error('Não foi possível iniciar a conversa.');
      }
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error);
      toast({
        title: 'Erro ao iniciar conversa',
        description: 'Não foi possível iniciar a conversa.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="relative bg-white rounded-lg p-6 shadow-md w-full max-w-md">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition">
          <CloseSquare size="24" />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Iniciar Nova Conversa</h2>

        {/* Barra de Pesquisa */}
        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm mb-4">
          <SearchNormal1 size="20" className="text-gray-500" />
          <input
            type="text"
            placeholder="Pesquisar administrador"
            className="ml-3 bg-white outline-none w-full placeholder-gray-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <ul className="space-y-3 overflow-y-auto max-h-60">
          {filteredStudents.map((student) => (
            <li
              key={student.id}
              onClick={() => handleStartConversation(student.id)}
              className="p-3 rounded-lg cursor-pointer flex items-center bg-gray-100 hover:bg-verdeAgua transition text-gray-800"
            >
              <div className="flex items-center space-x-3">
                {student.avatarUrl ? (
                  <img
                    src={student.avatarUrl}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <User size="40" className="text-gray-400" />
                )}
                <p className="font-semibold">{student.name}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
