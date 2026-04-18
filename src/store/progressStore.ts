import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProgressState {
  completedLessons: string[];
  markComplete: (lessonId: string) => void;
  isComplete: (lessonId: string) => boolean;
  reset: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      markComplete: (lessonId) =>
        set((s) => ({
          completedLessons: s.completedLessons.includes(lessonId)
            ? s.completedLessons
            : [...s.completedLessons, lessonId],
        })),
      isComplete: (lessonId) => get().completedLessons.includes(lessonId),
      reset: () => set({ completedLessons: [] }),
    }),
    { name: 'postgis-akademi-progress' },
  ),
);
