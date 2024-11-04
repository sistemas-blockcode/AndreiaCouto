import CourseDetails from '@/app/components/ui/CourseDetails';

interface CoursePageProps {
  params: { id: string };
}

export default function CoursePage({ params }: CoursePageProps) {
  if (!params.id) return <p>Curso não encontrado</p>;

  return <CourseDetails courseId={params.id} />;
}
