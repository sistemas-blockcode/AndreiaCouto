// tabela-cursos.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Book, Edit2, Trash, Refresh } from 'iconsax-react';
import ConfirmDeleteModal from './confirmar-delete-modal';
import { useCourses } from '@/app/components/context/CourseContext';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function TabelaCursos() {
  const router = useRouter();
  const { filteredCourses, fetchCourses } = useCourses();
  const [courseToDelete, setCourseToDelete] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleDeleteCourse = async () => {
    if (courseToDelete === null) return;

    try {
      const response = await fetch(`/api/courses/deleteCourses?courseId=${courseToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Curso deletado',
          description: 'O curso foi deletado com sucesso.',
          variant: 'success',
        });
        setCourseToDelete(null);
        setIsModalOpen(false);
        fetchCourses();
      } else {
        toast({
          title: 'Erro ao deletar',
          description: 'Houve um problema ao tentar deletar o curso.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao deletar curso:', error);
      toast({
        title: 'Erro no servidor',
        description: 'Erro ao deletar curso, tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Cursos</h2>
        <button
          className="flex items-center gap-2 bg-rosaVibrante text-white px-2 py-2 rounded-lg hover:bg-rosaClaro transition"
          onClick={fetchCourses}
        >
          <Refresh size="17" color="white" />
        </button>
      </div>

      <div className="hidden sm:grid grid-cols-5 gap-4 py-2 px-4 bg-[#F3F4F6] rounded-t-lg">
        <span className="text-sm font-semibold">Nome do Curso</span>
        <span className="text-sm font-semibold">Instrutor</span>
        <span className="text-sm font-semibold">Aulas</span>
        <span className="text-sm font-semibold">Alunos</span>
        <span className="text-sm font-semibold text-center">Ações</span>
      </div>

      {filteredCourses.map((course) => (
        <div key={course.id} className="grid grid-cols-1 sm:grid-cols-5 gap-4 py-4 px-4 items-center border-b">
          <div className="flex items-center gap-3">
            <div className="bg-[#c4dbff] px-2 py-2 rounded-lg">
              <Book size="24" color="#3B82F6" />
            </div>
            <div>
              <span className="text-md font-semibold block text-gray-500">{course.title}</span>
              <span className="text-sm text-gray-500 sm:hidden block">Instrutor: {course.instructor.name}</span>
              <span className="text-sm text-gray-500 sm:hidden block">Aulas: {course.lessonsCount || 0}</span>
              <span className="text-sm text-gray-500 sm:hidden block">Alunos: {course.studentsCount || 0}</span>
            </div>
          </div>

          <div className="hidden sm:block">
            <span className="text-sm text-gray-500">{course.instructor.name}</span>
          </div>

          <div className="hidden sm:block ml-3">
            <span className="text-sm text-gray-500">{course.lessonsCount || 0}</span>
          </div>

          <div className="hidden sm:block ml-5">
            <span className="text-sm text-gray-500">{course.studentsCount || 0}</span>
          </div>

          <div className="flex justify-center gap-3">
            <button 
              onClick={() => router.push(`/admin/cursos/${course.id}`)}
              className="text-blue-500 hover:bg-blue-100 p-2 rounded-full"
            >
              <Edit2 size="24" />
            </button>
            <button
              onClick={() => {
                setCourseToDelete(course.id);
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
        onConfirm={handleDeleteCourse}
        entityName="curso"
      />
    </div>
  );
}
