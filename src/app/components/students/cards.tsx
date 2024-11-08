// app/student/StudentCards.tsx
'use client';

import { useEffect, useState } from 'react';
import { Book, Calendar, Clock } from 'iconsax-react';
import { useAuth } from '@/app/components/context/AuthContext';

export default function StudentCards() {
  const { userId, loading } = useAuth(); 
  const [coursesCount, setCoursesCount] = useState(0);
  const [watchTime, setWatchTime] = useState(0);

  useEffect(() => {
    const fetchCoursesCount = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/students/getStudentCoursesCount?studentId=${userId}`);
        const data = await response.json();
        setCoursesCount(data.coursesCount || 0);
      } catch (error) {
        console.error('Error fetching course count:', error);
        setCoursesCount(0);
      }
    };

    const fetchWatchTime = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/students/getStudentWatchTime?studentId=${userId}`);
        const data = await response.json();
        setWatchTime(data.totalWatchTime || 0); // Total em segundos
      } catch (error) {
        console.error('Error fetching watch time:', error);
        setWatchTime(0);
      }
    };

    if (!loading) {
      fetchCoursesCount();
      fetchWatchTime();
    }
  }, [userId, loading]);

  const formatWatchTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        <div className="flex flex-col items-center text-center p-4 rounded-lg border border-gray-200 hover:border-verdeAgua transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105">
          <div className="p-3 rounded-full bg-[#e0e7ff] mb-3 hover:shadow-[0_0_10px_#4338CA] transition-shadow duration-300">
            <Book size="32" color="#4338CA" />
          </div>
          <span className="text-lg font-semibold text-gray-800">Cursos</span>
          <span className="text-xl font-regular text-gray-600 mt-1">{coursesCount}</span>
        </div>

        <div className="flex flex-col items-center text-center p-4 rounded-lg border border-gray-200 hover:border-verdeAgua transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105">
          <div className="p-3 rounded-full bg-[#ffe4e6] mb-3 hover:shadow-[0_0_10px_#DC2626] transition-shadow duration-300">
            <Calendar size="32" color="#DC2626" />
          </div>
          <span className="text-lg font-semibold text-gray-800">Chamadas Agendadas</span>
          <span className="text-xl font-regular text-gray-600 mt-1">5</span> 
        </div>

        <div className="flex flex-col items-center text-center p-4 rounded-lg border border-gray-200 hover:border-verdeAgua transition-all duration-300 shadow-sm hover:shadow-lg hover:scale-105">
          <div className="p-3 rounded-full bg-[#fff7ed] mb-3 hover:shadow-[0_0_10px_#EA580C] transition-shadow duration-300">
            <Clock size="32" color="#EA580C" />
          </div>
          <span className="text-lg font-semibold text-gray-800">Tempo Assistido</span>
          <span className="text-xl font-regular text-gray-600 mt-1">{formatWatchTime(watchTime)}</span>
        </div>
      </div>
    </div>
  );
}
