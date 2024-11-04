import Cards from "@/app/components/ui/cards";
import Sidebar from "@/app/components/ui/sidebar";
import TabelaAlunos from "@/app/components/ui/tabela-aluno";
import Buttons from "@/app/components/ui/buttons";
import Searchbar from "@/app/components/ui/searchbar2";
import { StudentsProvider } from '@/app/components/context/StudentsContext';


export default function Page() {
  return (
    <div className="flex">
      <StudentsProvider>
      <main className="flex-1 p-6 bg-gray-50">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Métricas da Plataforma</h2>
          <Cards />
        </div>

        <div>
          <div className="flex gap-4 items-center justify-between">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Lista de Alunos</h2>
            <Searchbar/>
            <Buttons title="Adicionar Aluno" type='ALUNO'/>
         </div>
          <TabelaAlunos />
        </div>
      </main>
      </StudentsProvider>
    </div>
  );
}
