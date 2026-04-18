import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCurriculumTree } from '@/curriculum/structure';
import { useProgressStore } from '@/store/progressStore';

const DAY_LABELS: Record<number, string> = {
  1: 'Gün 1 — Spatial SQL Fundamentals',
  2: 'Gün 2 — Sorgular, İndeks ve Performans',
  3: 'Gün 3 — Production, Ağ Analizi ve Proje',
};

export default function CurriculumSidebar() {
  const params = useParams<{ day: string; module: string; lesson: string }>();
  const activeDay = params.day ?? '';
  const activeModule = params.module ?? '';
  const activeLesson = params.lesson ?? '';
  const isComplete = useProgressStore((s) => s.isComplete);

  const tree = getCurriculumTree();
  // group by day
  const days = [1, 2, 3] as const;

  const [openDays, setOpenDays] = useState<Set<number>>(
    () => new Set([Number(activeDay.replace('day-', '')) || 1]),
  );
  const [openModules, setOpenModules] = useState<Set<string>>(
    () => new Set([`${activeDay}-${activeModule}`]),
  );

  function toggleDay(day: number) {
    setOpenDays((prev) => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  function toggleModule(key: string) {
    setOpenModules((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <nav className="h-full overflow-y-auto bg-surface text-sm select-none">
      <div className="px-3 py-3 border-b border-border">
        <Link to="/" className="text-xs font-mono uppercase tracking-widest text-text-muted hover:text-accent transition-colors">
          ← Ana Sayfa
        </Link>
      </div>

      {days.map((day) => {
        const dayNodes = tree.filter((n) => n.day === day);
        const isOpen = openDays.has(day);

        return (
          <div key={day}>
            <button
              onClick={() => toggleDay(day)}
              className="w-full flex items-center gap-1.5 px-3 py-2 text-left text-xs font-semibold text-text-muted uppercase tracking-wider hover:text-text transition-colors border-b border-border"
            >
              <span className={`transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
              {DAY_LABELS[day]}
            </button>

            {isOpen && dayNodes.map((node) => {
              const modKey = `day-${node.day}-module-${node.module}`;
              const isModOpen = openModules.has(modKey);
              const isActiveModule = activeDay === `day-${node.day}` && activeModule === `module-${node.module}`;

              return (
                <div key={modKey}>
                  <button
                    onClick={() => toggleModule(modKey)}
                    className={`w-full flex items-center gap-1.5 px-4 py-1.5 text-left text-xs hover:text-text transition-colors ${
                      isActiveModule ? 'text-accent' : 'text-text-muted'
                    }`}
                  >
                    <span className={`transition-transform shrink-0 ${isModOpen ? 'rotate-90' : ''}`}>▶</span>
                    <span>
                      {node.day}.{node.module} — {node.moduleTitle}
                    </span>
                  </button>

                  {isModOpen && (
                    <ul>
                      {node.lessons.map((lesson) => {
                        const isActive =
                          activeDay === `day-${lesson.day}` &&
                          activeModule === `module-${lesson.module}` &&
                          activeLesson === lesson.slug;
                        const done = isComplete(lesson.id);

                        return (
                          <li key={lesson.id}>
                            <Link
                              to={`/lesson/day-${lesson.day}/module-${lesson.module}/${lesson.slug}`}
                              className={`flex items-center gap-2 px-6 py-1.5 transition-colors ${
                                isActive
                                  ? 'bg-primary/30 text-accent font-medium'
                                  : 'text-text-muted hover:text-text hover:bg-surface-2'
                              }`}
                            >
                              <span className="shrink-0 w-4 text-center">
                                {done ? '✓' : <span className="inline-block w-2 h-2 rounded-full bg-border" />}
                              </span>
                              <span className="truncate">
                                {lesson.order}. {lesson.title}
                              </span>
                              <span className="ml-auto shrink-0 text-[10px] text-text-muted">
                                {lesson.estimatedMinutes}dk
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </nav>
  );
}
