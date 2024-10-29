// app/components/context/StudentsContext.tsx
'use client';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface Student {
  id: number;
  name: string;
  email: string;
  phone: string;
  courses: { title: string }[];
}

interface StudentsContextType {
  students: Student[];
  filteredStudents: Student[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchStudents: () => void;
  totalStudents: number; // Adiciona o total de alunos aqui
}

const StudentsContext = createContext<StudentsContextType | undefined>(undefined);

export const StudentsProvider = ({ children }: { children: ReactNode }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [totalStudents, setTotalStudents] = useState<number>(0); // Adiciona o estado do total de alunos

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students/getStudents');
      const data = await response.json();
      setStudents(data);
      setFilteredStudents(data);
      setTotalStudents(data.length); // Atualiza o total de alunos
    } catch (error) {
      console.error('Erro ao buscar alunos:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  return (
    <StudentsContext.Provider value={{ students, filteredStudents, searchTerm, setSearchTerm, fetchStudents, totalStudents }}>
      {children}
    </StudentsContext.Provider>
  );
};

export const useStudents = () => {
  const context = useContext(StudentsContext);
  if (!context) {
    throw new Error('useStudents deve ser usado dentro de um StudentsProvider');
  }
  return context;
};
