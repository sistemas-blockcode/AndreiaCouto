// CoursePlayer.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Check } from 'iconsax-react';

interface Lesson {
  id: number;
  title: string;
}

interface Course {
  id: number;
  title: string;
  lessons: Lesson[];
}

export default function CoursePlayer() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // URL do vídeo como blob
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!courseId) {
      router.push('/404');
      return;
    }

    const fetchCourseData = async () => {
      const response = await fetch(`/api/courses/${courseId}`);
      const data = await response.json();
      setCourse(data);

      if (data.lessons && data.lessons.length > 0) {
        setSelectedLesson(data.lessons[0]);
      }
    };

    fetchCourseData();
  }, [courseId, router]);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    fetchVideoData(lesson.id);
  };

  const fetchVideoData = async (lessonId: number) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}/video`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
    } catch (error) {
      console.error("Erro ao buscar o vídeo:", error);
    }
  };

  useEffect(() => {
    if (selectedLesson) {
      fetchVideoData(selectedLesson.id);
    }
  }, [selectedLesson]);

  if (!course || !selectedLesson) return <div>Carregando...</div>;

  return (
    <div className="flex h-screen bg-gray-50 ml-5">
      <div className="absolute top-0 left-0 w-full h-2 bg-gray-300">
        <div
          className="h-full bg-verde transition-all duration-200"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex-1 p-6 relative flex rounded ml-2">
        <div className="flex-1 pr-6">
          <h2 className="text-xl font-bold mb-4">{course.title}</h2>
          <video
            src={videoUrl || ''}
            controls
            controlsList="nodownload"
            className="w-full h-[450px] rounded-md shadow-md mb-4 bg-gray-900"
            onTimeUpdate={(e) =>
              setProgress((e.currentTarget.currentTime / e.currentTarget.duration) * 100)
            }
            onContextMenu={(e) => e.preventDefault()}
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </div>

        <div className="w-1/4 bg-gray-100 p-4 rounded-md shadow-md h-full border">
          <input
            type="text"
            placeholder="Busca"
            className="w-full p-2 mb-4 bg-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-verde"
          />
          <h4 className="text-gray-700 mb-3 text-base font-medium">Conteúdo do curso</h4>
          {course.lessons.map((lesson, index) => (
            <div
              key={lesson.id}
              onClick={() => handleLessonSelect(lesson)}
              className={`p-2 mb-3 cursor-pointer flex items-center rounded-md transition-colors ${
                selectedLesson.id === lesson.id ? 'bg-verde text-white' : 'bg-gray-100 text-gray-800'
              } hover:bg-gray-300`}
            >
              <span className="mr-2 font-semibold">{`#${index + 1}`}</span>
              <span className="text-sm flex-1">{lesson.title}</span>
              <Check
                size="18"
                className={`ml-2 ${
                  selectedLesson.id === lesson.id ? 'text-white' : 'text-gray-500'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
