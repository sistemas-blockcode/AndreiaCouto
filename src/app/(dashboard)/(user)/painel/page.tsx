// app/student/page.tsx
import StudentCards from '@/app/components/students/cards';
import CoursesList from '@/app/components/students/CoursList';

export default function Page() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Painel do Aluno</h1>

      <StudentCards />

      
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Continue Estudando</h2>
        <CoursesList />
      </div>
    </div>
  );
}
