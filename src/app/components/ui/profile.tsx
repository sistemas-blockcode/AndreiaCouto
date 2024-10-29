'use client';

import { useState, useEffect } from 'react';
import { User, Camera, CloseSquare } from 'iconsax-react';
import { useToast } from '@/hooks/use-toast'; 

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatarUrl?: string | null;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await fetch('/api/admins/getAdmins');
        const data = await response.json();

        if (response.ok && data.length > 0) {
          const adminData = data[0];
          setUser(adminData);
          setName(adminData.name);
          setAvatarUrl(adminData.avatarUrl || null);
        } else {
          console.error('Erro ao buscar o administrador:', data.message);
        }
      } catch (error) {
        console.error('Erro ao buscar o administrador:', error);
      }
    };

    fetchAdmin();
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSaveName = async () => {
    if (name.trim() === '') {
      toast({
        title: 'Erro',
        description: 'O nome não pode estar vazio!',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`/api/admins/updateName`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, name }),
      });

      if (response.ok) {
        setIsEditingName(false);
        setUser((prev) => (prev ? { ...prev, name } : null));

        toast({
          title: 'Sucesso',
          description: 'Nome alterado com sucesso!',
          variant: 'success',
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao alterar o nome.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar o nome:', error);
      toast({
        title: 'Erro',
        description: 'Erro no servidor, tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setName(user?.name || '');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const response = await fetch('/api/admins/deleteAvatar', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      if (response.ok) {
        setAvatarUrl(null); 
        toast({
          title: 'Sucesso',
          description: 'Foto de perfil removida com sucesso.',
          variant: 'success',
        });
      } else {
        console.error('Erro ao excluir a foto de perfil');
        toast({
          title: 'Erro',
          description: 'Erro ao excluir a foto de perfil.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao excluir a foto de perfil:', error);
      toast({
        title: 'Erro',
        description: 'Erro no servidor, tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg p-6 w-full max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-8 text-center">Informações do Administrador</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        <div className="flex flex-col items-center">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Foto de perfil"
                className="w-48 h-48 object-cover rounded-full shadow-md"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-full">
                <User size="48" color="#9CA3AF" />
              </div>
            )}

            <label className="absolute bottom-0 right-0 bg-verde rounded-full p-3 cursor-pointer">
              <Camera size="20" color="white" />
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          
          {avatarUrl && (
            <button
              onClick={handleDeleteAvatar}
              className="mt-4 text-red-600 hover:text-red-800 transition"
            >
              Excluir foto de perfil
            </button>
          )}
        </div>

        
        <div className="space-y-6">
          
          <div className="flex flex-col">
            <span className="text-lg font-semibold text-gray-600">Nome</span>
            <div className="flex items-center mt-2">
              {isEditingName ? (
                <div className="flex items-center w-full gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-verdeAgua"
                  />
                  <button
                    onClick={handleSaveName}
                    className="bg-verde text-white px-4 py-2 rounded-lg"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <CloseSquare size="24" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="text-xl text-gray-800">{user.name}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="ml-3 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
          </div>

          
          <div>
            <span className="text-lg font-semibold text-gray-600">E-mail</span>
            <p className="text-xl text-gray-800 mt-2">{user.email}</p>
          </div>

          
          <div>
            <span className="text-lg font-semibold text-gray-600">Telefone</span>
            <p className="text-xl text-gray-800 mt-2">{user.phone}</p>
          </div>

          
          <div>
            <span className="text-lg font-semibold text-gray-600">Função</span>
            <p className="text-xl text-gray-800 mt-2">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
