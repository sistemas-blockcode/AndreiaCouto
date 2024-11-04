import Profile from "@/app/components/ui/profile"
import Sidebar from "@/app/components/ui/sidebar";
import { CoursesProvider } from '@/app/components/context/CourseContext';


export default function Page() {
  return (
    <div className="flex">
      <CoursesProvider>
      <main className="flex-1 p-6 bg-gray-50">
        <Profile/>
      </main>
      </CoursesProvider>
    </div>
  );
}
