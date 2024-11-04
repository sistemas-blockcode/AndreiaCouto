'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, Video, Trash, ArrowLeft2 } from 'iconsax-react';
import { useToast } from '@/hooks/use-toast';
import VideoPlayerModal from '@/app/components/ui/VideoPlayerModal';
import ConfirmDeleteModal from '@/app/components/ui/confirmar-delete-modal';
import EditCourseModal from '@/app/components/ui/modal-editcourse';

interface Lesson {
  id: number;
  title: string;
  thumbnail: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: { name: string };
  lessons: Lesson[];
  thumbnail: string;
}

interface CourseDetailsProps {
  courseId: string;
}

export default function CourseDetails({ courseId }: CourseDetailsProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newLesson, setNewLesson] = useState<{ title: string; video: File | null; thumbnail: string }>({
    title: '',
    video: null,
    thumbnail: ''
  });
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<number | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}`);
      if (!response.ok) throw new Error('Erro ao carregar detalhes do curso');
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Erro ao carregar detalhes do curso:', error);
      toast({
        title: 'Erro ao carregar curso',
        description: 'Tente novamente mais tarde!',
        variant: 'destructive'
      });
    }
  };

  const handleAddLesson = async () => {
    if (!newLesson.title || !newLesson.video) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha o título e selecione o vídeo.',
        variant: 'destructive'
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', newLesson.title);
    formData.append('video', newLesson.video);
    formData.append('thumbnail', newLesson.thumbnail);

    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Erro ao adicionar aula');
      toast({
        title: 'Aula adicionada',
        description: 'A aula foi adicionada com sucesso.',
        variant: 'success'
      });
      fetchCourseDetails();
      setNewLesson({ title: '', video: null, thumbnail: '' });
    } catch (error) {
      console.error('Erro ao adicionar aula:', error);
      toast({
        title: 'Erro ao adicionar aula',
        description: 'Tente novamente mais tarde',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteLesson = async () => {
    if (lessonToDelete === null) return;

    try {
      const response = await fetch(`/api/courses/${courseId}/deleteLesson?lessonId=${lessonToDelete}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Lição deletada',
          description: 'A videoaula foi deletada com sucesso.',
          variant: 'success',
        });
        fetchCourseDetails();
        setLessonToDelete(null);
        setIsModalOpen(false);
      } else {
        toast({
          title: 'Erro ao deletar',
          description: 'Houve um problema ao tentar deletar a lição.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao deletar lição:', error);
      toast({
        title: 'Erro no servidor',
        description: 'Erro ao deletar a lição, tente novamente mais tarde.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  if (!course) return <p>Carregando...</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full overflow-y-auto">
      {/* Botão de voltar */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push('/admin/cursos')}
          className="flex items-center text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowLeft2 size="24" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">{course.title}</h2>
        <button
          onClick={() => setIsEditModalOpen(true)} // Abre o modal de edição
          className="flex items-center gap-2 bg-verde text-sm text-white px-4 py-2 rounded-lg hover:bg-verdeAgua transition"
        >
          <Edit2 size="18" />
          Editar Curso
        </button>
      </div>
      <div className='flex gap-2 mb-4 items-center'>
        <h2 className='font-semibold text-lg'>Descrição:</h2>
        <p className="text-md">{course.description}</p>
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700">Videoaulas</h3>
        <div className="hidden sm:grid grid-cols-4 gap-4 py-2 px-4 bg-[#F3F4F6] rounded-t-lg mt-4">
          <span className="text-sm font-semibold text-gray-600">Nº</span>
          <span className="text-sm font-semibold text-gray-600">Título</span>
          <span className="text-sm font-semibold text-gray-600">Thumbnail</span>
          <span className="text-sm font-semibold text-center text-gray-600">Ação</span>
        </div>

        {course.lessons.map((lesson, index) => (
          <div key={lesson.id} className="grid grid-cols-1 sm:grid-cols-4 gap-4 py-4 px-4 items-center border-b">
            <div className="text-gray-700 font-medium">{index + 1}</div>
            <div className="text-gray-700 font-medium">{lesson.title}</div>
            <div>
              <img src={lesson.thumbnail} alt={`Thumbnail de ${lesson.title}`} className="w-24 h-16 rounded" />
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setSelectedVideoUrl(`/api/courses/${courseId}/lessons/${lesson.id}/video`)}
                className="text-blue-500 hover:bg-blue-100 p-2 rounded-full flex items-center gap-1"
              >
                <Video size="18" />
              </button>
              <button
                onClick={() => {
                  setLessonToDelete(lesson.id);
                  setIsModalOpen(true);
                }}
                className="text-red-500 hover:bg-red-100 p-2 rounded-full"
              >
                <Trash size="18" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Adicionar nova videoaula</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          <input
            type="text"
            placeholder="Título da aula"
            value={newLesson.title}
            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
            className="border p-2 rounded col-span-1 sm:col-span-2"
          />
          <input
            type="file"
            accept="video/mp4"
            onChange={(e) => setNewLesson({ ...newLesson, video: e.target.files ? e.target.files[0] : null })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="URL da thumbnail"
            value={newLesson.thumbnail}
            onChange={(e) => setNewLesson({ ...newLesson, thumbnail: e.target.value })}
            className="border p-2 rounded"
          />
          <button
            onClick={handleAddLesson}
            className="px-1 py-2 font-semibold text-xs text-white bg-rosaVibrante rounded-lg w-auto"
          >
            Adicionar Aula
          </button>
        </div>
      </div>

      {/* Modal de Vídeo */}
      {selectedVideoUrl && (
        <VideoPlayerModal
          videoUrl={selectedVideoUrl}
          isOpen={Boolean(selectedVideoUrl)}
          onClose={() => setSelectedVideoUrl(null)}
        />
      )}

      {/* Modal de Confirmação de Deleção */}
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteLesson}
        entityName="videoaula"
      />

      {/* Modal de Edição do Curso */}
      {isEditModalOpen && course && (
        <EditCourseModal
          courseId={course.id}
          initialTitle={course.title}
          initialThumbnail={course.thumbnail}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={fetchCourseDetails} // Atualiza os detalhes do curso após edição
        />
      )}
    </div>
  );
}
