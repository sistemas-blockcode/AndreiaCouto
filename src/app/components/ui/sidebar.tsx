'use client';

import { Home2, User, Video, Message, Setting, LogoutCurve } from 'iconsax-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `text-gray-500 rounded-lg p-2 ${
      pathname === path ? 'bg-verdeAgua text-verde' : 'hover:bg-verdeAgua hover:text-verde'
    }`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col justify-between w-20 min-h-screen bg-white shadow-md border-r border-[1.5px] overflow-y-auto">
      <div className="flex flex-col items-center py-12">
        <div className="flex flex-col items-center space-y-8">
          <Link href="/admin/dash" className={linkClasses('/admin/dash')}>
            <Home2 size="23" />
          </Link>

          <Link href="/admin/users" className={linkClasses('/admin/users')}>
            <User size="23" />
          </Link>

          <Link href="/admin/cursos" className={linkClasses('/admin/cursos')}>
            <Video size="23" />
          </Link>

          <Link href="/admin/chats" className={linkClasses('/admin/chats')}>
            <Message size="23" />
          </Link>

          <Link href="/admin/settings" className={linkClasses('/admin/settings')}>
            <Setting size="23" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center pb-12">
        <button onClick={handleLogout} className="text-gray-500 hover:bg-verdeAgua hover:text-verde rounded-lg p-2">
          <LogoutCurve size="23" />
        </button>
      </div>
    </div>
  );
}
