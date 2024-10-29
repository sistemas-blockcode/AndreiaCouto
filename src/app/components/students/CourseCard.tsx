// app/components/ui/CourseCard.tsx

'use client';
import { PlayCircle } from 'iconsax-react';

interface CourseCardProps {
  imageUrl: string;
  courseName: string;
  instructorName: string;
}

export default function CourseCard({ imageUrl, courseName, instructorName }: CourseCardProps) {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-lg p-4 hover:shadow-md transition-shadow duration-200 w-full max-w-lg">
      {/* Imagem do Curso */}
      <img
        src={imageUrl}
        alt={`${courseName} thumbnail`}
        className="w-24 h-24 rounded-lg object-cover mr-4"
      />

      {/* Informações do Curso */}
      <div className="flex flex-col flex-grow gap-y-2">
        <h3 className="text-xl font-semibold text-gray-700">{courseName}</h3>
        <p className="text-gray-500 text-lg">{instructorName}</p>
      </div>

      {/* Botão de Play */}
      <button className="ml-auto">
        <PlayCircle size="55" color="#18A698" variant="Bold" className="hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
