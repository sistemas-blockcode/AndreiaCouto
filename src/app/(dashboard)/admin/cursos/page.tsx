import Sidebar from "@/app/components/ui/sidebar";
import TabelaCursos from "@/app/components/ui/tabela-cursos";
import Buttons from "@/app/components/ui/buttons";
import Searchbar from "@/app/components/ui/searchbar";
import { CoursesProvider } from '@/app/components/context/CourseContext';

export default function Page() {
  return (
    <div className="flex">
      <CoursesProvider>
        <main className="flex-1 p-6 bg-gray-50">
          <div>
            <div className="flex gap-4 items-center justify-between">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Lista de Cursos</h2>
              <Searchbar />
              <Buttons title="Adicionar Curso" type="CURSO"/>
            </div>
            <TabelaCursos />
          </div>
        </main>
      </CoursesProvider>
    </div>
  );
}
