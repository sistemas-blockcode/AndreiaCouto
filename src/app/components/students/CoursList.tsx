// app/components/students/CoursesList.tsx
'use client';
import { useEffect, useState } from 'react';
import CourseCard from './CourseCard';
import { useAuth } from '@/app/components/context/AuthContext';

interface Course {
  id: number;
  title: string;
  thumbnail: string;
  instructor: { name: string };
}

export default function CoursesList() {
  const { userId } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/students/${userId}/courses`);
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Erro ao buscar cursos do usuário:', error);
      }
    };

    fetchCourses();
  }, [userId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          courseId={course.id} // Adiciona courseId como propriedade
          imageUrl={course.thumbnail || '/default-thumbnail.jpg'}
          courseName={course.title}
          instructorName={course.instructor.name}
        />
      ))}
    </div>
  );
}
