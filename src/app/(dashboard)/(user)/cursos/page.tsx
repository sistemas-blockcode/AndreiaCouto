import CoursesList from '@/app/components/students/CoursList';
export default function Page() {
    return (
      <div className='px-2 py-3'>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Meus Cursos</h1>
        <div><CoursesList /></div>
      </div>
    );
  }
  