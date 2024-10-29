import Sidebar from "@/app/components/ui/sidebar";
import TabelaAdmin from "@/app/components/ui/tabela-admin";
import Buttons from "@/app/components/ui/buttons";
import Searchbar from "@/app/components/ui/searchbar2";
import { StudentsProvider } from '@/app/components/context/StudentsContext';


export default function Page() {
  return (
    <div className="flex">
      <Sidebar />

      <StudentsProvider>
      <main className="flex-1 p-6 bg-gray-50">
        <div>
          <div className="flex gap-4 items-center justify-between">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Lista de Administradores</h2>
            <Searchbar/>
            <Buttons title="Adicionar Administrador" type='ADMIN'/>
         </div>
          <TabelaAdmin />
        </div>
      </main>
      </StudentsProvider>
    </div>
  );
}
