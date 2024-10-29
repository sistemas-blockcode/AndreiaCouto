'use client';
import { useState, useEffect } from 'react';
import { User, Edit2, Trash, Refresh } from 'iconsax-react';
import ConfirmDeleteModal from './confirmar-delete-modal';
import { useToast } from '@/hooks/use-toast';

interface Admin {
  id: number;
  name: string;
  email: string;
  phone: string;
  taughtCourses: { title: string }[];
}

export default function TabelaAdmin() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetches the list of admins
  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/admins/getAdmins');
      const data = await response.json();
      if (response.ok) {
        setAdmins(data);
      } else {
        console.error('Erro ao buscar administradores:', data.message);
      }
    } catch (error) {
      console.error('Erro ao buscar administradores:', error);
    }
  };

  const handleDeleteAdmin = async () => {
    if (adminToDelete === null) return;

    try {
      const response = await fetch(`/api/admins/deleteAdmin?adminId=${adminToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Administrador deletado',
          description: 'O administrador foi deletado com sucesso.',
          variant: 'success',
        });
        setAdminToDelete(null);
        setIsModalOpen(false);
        fetchAdmins(); // Refresh the list after deletion
      } else {
        toast({
          title: 'Erro ao deletar',
          description: 'Houve um problema ao tentar deletar o administrador.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao deletar administrador:', error);
      toast({
        title: 'Erro no servidor',
        description: 'Erro ao deletar administrador, tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Administradores</h2>
        <button
          className="flex items-center gap-2 bg-rosaVibrante text-white px-2 py-2 rounded-lg hover:bg-rosaClaro transition"
          onClick={fetchAdmins}
        >
          <Refresh size="17" color="white" />
        </button>
      </div>

      <div className="hidden sm:grid grid-cols-5 gap-4 py-2 px-4 bg-[#F3F4F6] rounded-t-lg">
        <span className="text-sm font-semibold">Nome do Admin</span>
        <span className="text-sm font-semibold">Número</span>
        <span className="text-sm font-semibold">E-mail</span>
        <span className="text-sm font-semibold">Cursos Ministrados</span>
        <span className="text-sm font-semibold text-center">Ações</span>
      </div>

      {admins.map((admin) => (
        <div
          key={admin.id}
          className="grid grid-cols-1 sm:grid-cols-5 gap-4 py-4 px-4 items-center border-b"
        >
          <div className="flex items-center gap-3">
            <div className="bg-[#c4dbff] px-2 py-2 rounded-lg">
              <User size="24" color="#3B82F6" />
            </div>
            <div>
              <span className="text-md font-semibold block text-gray-500">{admin.name}</span>
              <span className="text-sm text-gray-500 sm:hidden block">Número: {admin.phone}</span>
              <span className="text-sm text-gray-500 sm:hidden block">E-mail: {admin.email}</span>
              <span className="text-sm text-gray-500 sm:hidden block">
                Cursos Ministrados: {admin.taughtCourses.map((course) => course.title).join(', ') || 0}
              </span>
            </div>
          </div>

          <div className="hidden sm:block">
            <span className="text-sm text-gray-500">{admin.phone}</span>
          </div>

          <div className="hidden sm:block -ml-5">
            <span className="text-sm text-gray-500">{admin.email}</span>
          </div>

          <div className="hidden sm:block ml-5">
            <span className="text-sm text-gray-500">
              {admin.taughtCourses.map((course) => course.title).join(', ')}
            </span>
          </div>

          <div className="flex justify-center gap-3">
            <button className="text-blue-500 hover:bg-blue-100 p-2 rounded-full">
              <Edit2 size="24" />
            </button>
            <button
              onClick={() => {
                setAdminToDelete(admin.id);
                setIsModalOpen(true);
              }}
              className="text-red-500 hover:bg-red-100 p-2 rounded-full"
            >
              <Trash size="24" />
            </button>
          </div>
        </div>
      ))}

      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteAdmin}
        entityName="administrador"
      />
    </div>
  );
}
