import Sidebar from '@/app/components/ui/sidebar';
import { AuthProvider } from '@/app/components/context/AuthContext';

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
