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

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses/getCourses');
      const data = await response.json();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

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
