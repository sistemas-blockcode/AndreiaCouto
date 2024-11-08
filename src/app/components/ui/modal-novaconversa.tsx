// modal-novaconversa.tsx
'use client';
import { useState, useEffect } from 'react';
import { CloseSquare, SearchNormal1, User } from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';

type Student = {
  id: number;
  name: string;
  avatarUrl?: string | null;
};

interface ModalNovaConversaProps {
  onClose: () => void;
  onSelectConversation: (id: number) => void;
  adminId: number;
  fetchConversations: () => void;
}

export default function ModalNovaConversa({ onClose, onSelectConversation, adminId, fetchConversations }: ModalNovaConversaProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Função para buscar alunos
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students/getStudents');
        const data = await response.json();
        setStudents(data);
        setFilteredStudents(data);
      } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        toast({
          title: 'Erro ao buscar alunos',
          description: 'Não foi possível carregar a lista de alunos.',
          variant: 'destructive',
        });
      }
    };

    fetchStudents();
  }, []);

  // Função para atualizar `filteredStudents` com base no `searchTerm`
  useEffect(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  // Definição da função `handleSearch`
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStartConversation = async (studentId: number) => {
    try {
      const response = await fetch('/api/conversations/createOrGetConversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participantAId: adminId, participantBId: studentId }),
      });

      if (!response.ok) throw new Error('Erro ao iniciar conversa');
      const conversation = await response.json();

      toast({
        title: 'Conversa iniciada!',
        description: `Conversa com o aluno ID: ${studentId} foi iniciada.`,
        variant: 'success',
      });

      fetchConversations(); // Recarrega as conversas no Sidechat
      onSelectConversation(conversation.id); // Seleciona a conversa criada
      onClose(); // Fecha o modal
    } catch (error) {
      console.error('Erro ao iniciar conversa:', error);
      toast({
        title: 'Erro ao iniciar conversa',
        description: 'Não foi possível iniciar a conversa.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div className="relative bg-white rounded-lg p-6 shadow-md w-full max-w-md">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition">
          <CloseSquare size="24" />
        </button>
        
        <h2 className="text-xl font-semibold mb-4">Iniciar Nova Conversa</h2>

        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm mb-4">
          <SearchNormal1 size="20" className="text-gray-500" />
          <input
            type="text"
            placeholder="Pesquisar aluno"
            className="ml-3 bg-white outline-none w-full placeholder-gray-500"
            value={searchTerm}
            onChange={handleSearch} // Atualizando o valor com handleSearch
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
                  <img src={student.avatarUrl} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
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
