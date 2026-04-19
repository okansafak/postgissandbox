import { Link } from 'react-router-dom';
import { getCurriculumTree } from '@/curriculum/structure';
import { useProgressStore } from '@/store/progressStore';

const SECTION_TITLES: Record<number, string> = {
  1: 'Spatial SQL Fundamentals',
  2: 'Sorgular, İndeks ve Performans',
  3: 'Production, Ağ Analizi ve Proje',
};

export default function Dashboard() {
  const tree = getCurriculumTree();
  const completedLessons = useProgressStore((s) => s.completedLessons);

  const totalLessons = tree.reduce((acc, n) => acc + n.lessons.length, 0);
  const totalCompleted = completedLessons.length;
  const totalPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const days = [1, 2, 3] as const;

  return (
    <div className="h-full overflow-y-auto bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-border">
        <div>
          <h1 className="text-2xl font-semibold text-text">PostGIS Akademi</h1>
          <p className="text-sm text-text-muted mt-0.5">Tarayıcıda çalışan PostGIS öğrenme platformu</p>
        </div>
        <Link
          to="/lesson/day-1/module-1/lesson-1"
          className="px-4 py-2 rounded-lg bg-surface-2 border border-border text-sm text-text-muted hover:text-text hover:border-accent transition-colors"
        >
          Oyun Alanı →
        </Link>
      </div>

      {/* Global progress */}
      <div className="px-8 py-5 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-muted">
            <span className="text-text font-medium">{totalCompleted}</span> / {totalLessons} ders tamamlandı
          </span>
          <span className="text-sm font-medium text-accent">%{totalPct}</span>
        </div>
        <div className="h-2 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${totalPct}%` }}
          />
        </div>
      </div>

      {/* Section cards */}
      <div className="px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {days.map((day) => {
          const dayNodes = tree.filter((n) => n.day === day);
          const dayLessons = dayNodes.flatMap((n) => n.lessons);
          const dayCompleted = dayLessons.filter((l) => completedLessons.includes(l.id)).length;
          const dayTotal = dayLessons.length;
          const dayPct = dayTotal > 0 ? Math.round((dayCompleted / dayTotal) * 100) : 0;
          const moduleCount = dayNodes.length;

          const firstIncomplete = dayLessons.find((l) => !completedLessons.includes(l.id));
          const ctaLesson = firstIncomplete ?? dayLessons[0];
          const ctaLink = ctaLesson
            ? `/lesson/day-${ctaLesson.day}/module-${ctaLesson.module}/${ctaLesson.slug}`
            : `/lesson/day-${day}/module-1/lesson-1`;
          const isStarted = dayCompleted > 0;

          return (
            <div
              key={day}
              className="flex flex-col gap-4 p-5 rounded-xl border border-border bg-surface-2 hover:border-primary/50 transition-colors"
            >
              <div>
                <div className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-1">
                  Bölüm {day}
                </div>
                <h2 className="text-base font-semibold text-text leading-snug">
                  {SECTION_TITLES[day]}
                </h2>
              </div>

              <div className="text-xs text-text-muted">
                {moduleCount} modül · {dayTotal} ders
              </div>

              <div>
                <div className="flex justify-between text-xs text-text-muted mb-1">
                  <span>{dayCompleted} / {dayTotal} tamamlandı</span>
                  <span className="text-accent">%{dayPct}</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${dayPct}%` }}
                  />
                </div>
              </div>

              <Link
                to={ctaLink}
                className="mt-auto inline-block text-center px-4 py-2 rounded-lg bg-primary hover:bg-primary-light text-white text-sm font-medium transition-colors"
              >
                {isStarted ? 'Devam Et →' : 'Başla →'}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
