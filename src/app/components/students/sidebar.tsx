'use client';

import { Home2, Video, Message, Notification, Setting, LogoutCurve, User as UserIcon } from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StudentSidebar() {
  const pathname = usePathname();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const linkClasses = (path: string) => {
    const isActive = pathname === path;
    return `relative flex items-center justify-center p-2 transition-all duration-300 ease-out ${
      isActive
        ? 'bg-verdeAgua text-verde scale-110 shadow-md shadow-verdeAgua/50'
        : 'text-gray-500 hover:bg-verdeAgua hover:text-verde hover:scale-105'
    } rounded-lg`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/students/getStudents');
        const data = await response.json();

        // Supondo que o aluno autenticado seja o primeiro no array retornado
        if (data.length > 0) {
          setProfilePicture(data[0].avatarUrl || null);
        }
      } catch (error) {
        console.error('Erro ao buscar foto de perfil:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <div className="flex flex-col justify-between w-20 min-h-screen bg-white shadow-md border-r border-[1.5px] overflow-y-auto">
      <div className="flex flex-col items-center py-8">
        <div className="flex flex-col items-center space-y-8">
          {/* Foto de Perfil */}
          <div className="mb-4">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Foto do usuário"
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <UserIcon size="24" color="#6B7280" />
              </div>
            )}
          </div>

          {/* Links da Sidebar */}
          <Link href="/painel" className={linkClasses('/painel')}>
            <Home2 size={pathname === '/painel' ? '28' : '23'} />
          </Link>

          <Link href="/cursos" className={linkClasses('/cursos')}>
            <Video size={pathname === '/cursos' ? '28' : '23'} />
          </Link>

          <Link href="/chat" className={linkClasses('/chat')}>
            <Message size={pathname === '/chat' ? '28' : '23'} />
          </Link>

          <Link href="/student/notifications" className={linkClasses('/student/notifications')}>
            <Notification size={pathname === '/student/notifications' ? '28' : '23'} />
          </Link>

          <Link href="/config" className={linkClasses('/config')}>
            <Setting size={pathname === '/config' ? '28' : '23'} />
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center pb-12">
        <button
          onClick={handleLogout}
          className="text-gray-500 hover:bg-verdeAgua hover:text-verde rounded-lg p-2 hover:scale-105 transition-all duration-300 ease-out"
        >
          <LogoutCurve size="23" />
        </button>
      </div>
    </div>
  );
}
