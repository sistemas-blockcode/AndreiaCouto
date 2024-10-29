'use client';
import { useState } from 'react';
import { User, Edit2, Trash, Refresh } from 'iconsax-react';
import ConfirmDeleteModal from './confirmar-delete-modal';
import { useToast } from '@/hooks/use-toast';
import { useStudents } from '@/app/components/context/StudentsContext';

export default function TabelaAlunos() {
  const { filteredStudents, fetchStudents } = useStudents();
  const [studentToDelete, setStudentToDelete] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleDeleteStudent = async () => {
    if (studentToDelete === null) return;

    try {
      const response = await fetch(`/api/students/deleteStudents?studentId=${studentToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Aluno deletado',
          description: 'O aluno foi deletado com sucesso.',
          variant: 'success',
        });
        setStudentToDelete(null);
        setIsModalOpen(false);
        fetchStudents(); // Atualiza a lista após deletar
      } else {
        toast({
          title: 'Erro ao deletar',
          description: 'Houve um problema ao tentar deletar o aluno.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      toast({
        title: 'Erro no servidor',
        description: 'Erro ao deletar aluno, tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Alunos</h2>
        <button
          className="flex items-center gap-2 bg-rosaVibrante text-white px-2 py-2 rounded-lg hover:bg-rosaClaro transition"
          onClick={fetchStudents}
        >
          <Refresh size="17" color="white" />
        </button>
      </div>

      <div className="hidden sm:grid grid-cols-5 gap-4 py-2 px-4 bg-[#F3F4F6] rounded-t-lg">
        <span className="text-sm font-semibold">Nome do Aluno</span>
        <span className="text-sm font-semibold">Número</span>
        <span className="text-sm font-semibold">E-mail</span>
        <span className="text-sm font-semibold">Curso Cadastrado</span>
        <span className="text-sm font-semibold text-center">Ações</span>
      </div>

      {filteredStudents.map((student) => (
        <div
          key={student.id}
          className="grid grid-cols-1 sm:grid-cols-5 gap-4 py-4 px-4 items-center border-b"
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#c4dbff] px-2 py-2 rounded-lg">
              <User size="24" color="#3B82F6" />
            </div>
            <div>
              <span className="text-md font-semibold block text-gray-500">{student.name}</span>
              <span className="text-sm text-gray-500 sm:hidden block">Número: {student.phone}</span>
              <span className="text-sm text-gray-500 sm:hidden block">E-mail: {student.email}</span>
              <span className="text-sm text-gray-500 sm:hidden block">
                Curso: {student.courses.map((course) => course.title).join(', ')}
              </span>
            </div>
          </div>

          <div className="hidden sm:block">
            <span className="text-sm text-gray-500">{student.phone}</span>
          </div>

          <div className="hidden sm:block -ml-5">
            <span className="text-sm text-gray-500">{student.email}</span>
          </div>

          <div className="hidden sm:block ml-5">
            <span className="text-sm text-gray-500">
              {student.courses.map((course) => course.title).join(', ')}
            </span>
          </div>

          <div className="flex justify-center gap-3">
            <button className="text-blue-500 hover:bg-blue-100 p-2 rounded-full">
              <Edit2 size="24" />
            </button>
            <button
              onClick={() => {
                setStudentToDelete(student.id);
                setIsModalOpen(true);
              }}
              className="text-red-500 hover:bg-red-100 p-2 rounded-full"
            >
              <Trash size="24" />
            </button>
          </div>
        </div>
      ))}

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteStudent}
        entityName="aluno"
      />
    </div>
  );
}
