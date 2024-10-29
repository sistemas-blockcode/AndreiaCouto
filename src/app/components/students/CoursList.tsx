// app/components/students/CoursesList.tsx
'use client'
import CourseCard from './CourseCard';

export default function CoursesList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
      <CourseCard
        imageUrl="/logotipo.svg"
        courseName="Terapia Curso - 1"
        instructorName="Pietro"
      />
      <CourseCard
        imageUrl="/logotipo.svg"
        courseName="Terapia Curso - 2"
        instructorName="Pietro"
      />
      <CourseCard
        imageUrl="/logotipo.svg"
        courseName="Terapia Curso - 3"
        instructorName="Pietro"
      />
      <CourseCard
        imageUrl="/logotipo.svg"
        courseName="Terapia Curso - 4"
        instructorName="Pietro"
      />
    </div>
  );
}
