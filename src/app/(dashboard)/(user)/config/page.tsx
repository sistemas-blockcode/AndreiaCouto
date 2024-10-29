import Profile from "@/app/components/students/profile"
import { StudentsProvider } from '@/app/components/context/StudentsContext';


export default function Page() {
  return (
    <div className="flex">
      <StudentsProvider>
      <main className="flex-1 p-6 bg-gray-50">
        <Profile/>
      </main>
      </StudentsProvider>
    </div>
  );
}
