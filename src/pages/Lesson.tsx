import { useParams } from 'react-router-dom';
import LessonLayout from '@/components/lesson/LessonLayout';

/** Lesson sayfası — URL: /lesson/:day/:module/:lesson */
export default function Lesson() {
  const { day = 'day-1', module: mod = 'module-1', lesson = 'lesson-1' } = useParams<{
    day: string;
    module: string;
    lesson: string;
  }>();

  return <LessonLayout day={day} module={mod} lesson={lesson} />;
}
