import StudentSidebar from '../../components/students/sidebar';
import { AuthProvider } from '@/app/components/context/AuthContext';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
    <div className="flex h-screen">
      <StudentSidebar />
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        {children}
      </main>
    </div>
    </AuthProvider>
  );
}
