'use client'
import { useEffect, useState } from 'react';
import { Book, Teacher, PlayCircle, Call } from 'iconsax-react';
import { useStudents } from '@/app/components/context/StudentsContext';

export default function Cards() {
  const { students, fetchStudents } = useStudents(); // Obtenha students do contexto
  const [totalCourses, setTotalCourses] = useState(0);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses/getCourses');
      const data = await response.json();
      if (response.ok) {
        setTotalCourses(data.length); 
      } else {
        console.error('Erro ao buscar cursos:', data.message);
        setTotalCourses(0);
      }
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      setTotalCourses(0);
    }
  };

  useEffect(() => {
    fetchStudents(); // Atualiza ao carregar
    fetchCourses();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        
        <div className="flex items-center gap-3 sm:border-r-[2.9px] border-[#dcdfe7b4] pr-4">
          <div className="px-2 py-2 rounded-lg bg-[#dbeafe]">
            <Teacher size="32" color="#1D4ED8" />
          </div>
          <div>
            <span className="text-md font-semibold block">Total de Alunos</span>
            <span className="text-gray-500 text-lg">{students.length}</span> 
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-r-[2.9px] border-[#dcdfe7b4] pr-4">
          <div className="px-2 py-2 rounded-lg bg-[#e0e7ff]">
            <Book size="32" color="#4338CA" />
          </div>
          <div>
            <span className="text-md font-semibold block">Total de Cursos</span>
            <span className="text-gray-500 text-lg">{totalCourses}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:border-r-[2.9px] border-[#dcdfe7b4] pr-4">
          <div className="px-2 py-2 rounded-lg bg-[#fff7ed]">
            <PlayCircle size="32" color="#EA580C" />
          </div>
          <div>
            <span className="text-md font-semibold block">Total de Videoaulas</span>
            <span className="text-gray-500 text-lg">120</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-2 py-2 rounded-lg bg-[#ffe4e6]">
            <Call size="32" color="#DC2626" />
          </div>
          <div>
            <span className="text-md font-semibold block">Chamadas Realizadas</span>
            <span className="text-gray-500 text-lg">120</span>
          </div>
        </div>
      </div>
    </div>
  );
}
