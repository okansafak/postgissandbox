import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCurriculumTree } from '@/curriculum/structure';
import { useProgressStore } from '@/store/progressStore';
import { ArrowLeft, ChevronRight, Check, Dot, Search } from '@/components/ui/Icons';

const SECTION_LABELS: Record<number, string> = {
  1: 'Bölüm 1 — Spatial SQL Fundamentals',
  2: 'Bölüm 2 — Sorgular, İndeks ve Performans',
  3: 'Bölüm 3 — Production, Ağ Analizi ve Proje',
};

export default function CurriculumSidebar() {
  const params = useParams<{ day: string; module: string; lesson: string }>();
  const activeDay = params.day ?? '';
  const activeModule = params.module ?? '';
  const activeLesson = params.lesson ?? '';
  const completedLessons = useProgressStore((s) => s.completedLessons);

  const tree = getCurriculumTree();
  const days = [1, 2, 3] as const;

  const [openDays, setOpenDays] = useState<Set<number>>(
    () => new Set([Number(activeDay.replace('day-', '')) || 1]),
  );
  const [openModules, setOpenModules] = useState<Set<string>>(
    () => new Set([`${activeDay}-${activeModule}`]),
  );
  const [query, setQuery] = useState('');

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

  const q = query.trim().toLowerCase();
  const filteredTree = q
    ? tree
        .map((node) => ({
          ...node,
          lessons: node.lessons.filter(
            (l) =>
              l.title.toLowerCase().includes(q) ||
              (l.tags ?? []).some((t: string) => t.toLowerCase().includes(q)),
          ),
        }))
        .filter((node) => node.lessons.length > 0)
    : tree;

  return (
    <nav className="h-full overflow-y-auto bg-surface text-sm select-none">
      <div className="px-3 py-3 border-b border-border flex flex-col gap-2">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={13} />
          Ana Sayfa
        </Link>
        <div className="relative">
          <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="search"
            placeholder="Ders ara…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 text-xs rounded border border-border bg-surface-2
                       text-text placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {days.map((day) => {
        const dayNodes = filteredTree.filter((n) => n.day === day);
        if (dayNodes.length === 0 && q) return null;

        const isOpen = q ? true : openDays.has(day);

        return (
          <div key={day}>
            <button
              onClick={() => !q && toggleDay(day)}
              className="w-full flex items-center gap-1.5 px-3 py-2 text-left text-xs font-semibold text-text-muted uppercase tracking-wider hover:text-text transition-colors border-b border-border"
            >
              <ChevronRight
                size={11}
                className={`shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`}
              />
              {SECTION_LABELS[day]}
            </button>

            {isOpen && dayNodes.map((node) => {
              const modKey = `day-${node.day}-module-${node.module}`;
              const isModOpen = q ? true : openModules.has(modKey);
              const isActiveModule = activeDay === `day-${node.day}` && activeModule === `module-${node.module}`;

              return (
                <div key={modKey}>
                  <button
                    onClick={() => !q && toggleModule(modKey)}
                    className={`w-full flex items-center gap-1.5 px-4 py-1.5 text-left text-xs hover:text-text transition-colors ${
                      isActiveModule ? 'text-accent' : 'text-text-muted'
                    }`}
                  >
                    <ChevronRight
                      size={10}
                      className={`shrink-0 transition-transform ${isModOpen ? 'rotate-90' : ''}`}
                    />
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
                        const done = completedLessons.includes(lesson.id);

                        return (
                          <li key={lesson.id}>
                            <Link
                              to={`/lesson/day-${lesson.day}/module-${lesson.module}/${lesson.slug}`}
                              className={`flex items-center gap-2 px-6 py-1.5 transition-colors ${
                                isActive
                                  ? 'bg-primary/20 text-accent font-medium'
                                  : 'text-text-muted hover:text-text hover:bg-surface-2'
                              }`}
                            >
                              <span className="shrink-0 w-4 flex items-center justify-center">
                                {done
                                  ? <Check size={12} className="text-accent" />
                                  : <Dot size={6} className="text-border" />
                                }
                              </span>
                              <span className="truncate" title={lesson.title}>
                                {lesson.order}. {lesson.title}
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
