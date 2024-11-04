'use client';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Course {
  id: number;
  title: string;
  instructor: {
    name: string;
  };
  lessonsCount?: number;
  studentsCount?: number;
}

interface CoursesContextType {
  courses: Course[];
  filteredCourses: Course[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchCourses: () => void;
}

const CoursesContext = createContext<CoursesContextType | undefined>(undefined);

export const CoursesProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Atualizar fetchCourses para buscar a contagem de aulas para cada curso
  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses/getCourses');
      const data: Course[] = await response.json();

      // Para cada curso, buscar a contagem de aulas individualmente
      const coursesWithLessonsCount = await Promise.all(
        data.map(async (course) => {
          try {
            const lessonsCountResponse = await fetch(`/api/courses/${course.id}/lessonsCount`);
            if (!lessonsCountResponse.ok) {
              throw new Error(`Erro ao obter contagem de aulas para o curso ${course.id}`);
            }
            const { lessonsCount } = await lessonsCountResponse.json();
            return { ...course, lessonsCount };
          } catch (error) {
            console.error(`Erro ao obter contagem de aulas para o curso ${course.id}:`, error);
            return { ...course, lessonsCount: 0 }; // Define como 0 caso haja erro na contagem
          }
        })
      );

      setCourses(coursesWithLessonsCount);
      setFilteredCourses(coursesWithLessonsCount);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    }
  };

  // Atualizar filteredCourses quando searchTerm muda
  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  // Executar fetchCourses apenas uma vez ao carregar o contexto
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <CoursesContext.Provider value={{ courses, filteredCourses, searchTerm, setSearchTerm, fetchCourses }}>
      {children}
    </CoursesContext.Provider>
  );
};

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses deve ser usado dentro de um CoursesProvider');
  }
  return context;
};
