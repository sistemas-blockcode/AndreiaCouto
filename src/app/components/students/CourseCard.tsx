// app/components/ui/CourseCard.tsx
'use client';
import { useRouter } from 'next/navigation';
import { PlayCircle } from 'iconsax-react';

interface CourseCardProps {
  courseId: number; // Adicione o courseId como propriedade
  imageUrl: string;
  courseName: string;
  instructorName: string;
}

export default function CourseCard({ courseId, imageUrl, courseName, instructorName }: CourseCardProps) {
  const router = useRouter();

  const handlePlayClick = () => {
    router.push(`/player/${courseId}`); // Direciona para a página de player do curso
  };

  return (
    <div className="flex items-center bg-white rounded-lg shadow-lg p-4 hover:shadow-md transition-shadow duration-200 w-full max-w-lg">
      <img
        src={imageUrl}
        alt={`${courseName} thumbnail`}
        className="w-24 h-24 rounded-lg object-cover mr-4"
      />

      <div className="flex flex-col flex-grow gap-y-2">
        <h3 className="text-xl font-semibold text-gray-700">{courseName}</h3>
        <p className="text-gray-500 text-lg">{instructorName}</p>
      </div>

      <button onClick={handlePlayClick} className="ml-auto">
        <PlayCircle size="55" color="#18A698" variant="Bold" className="hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
