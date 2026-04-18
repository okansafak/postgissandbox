import { Suspense, useEffect, useState, type ComponentType } from 'react';
import { Link } from 'react-router-dom';
import RunnableBlock from './RunnableBlock';
import { getLessonByRoute, getNextLesson, getPrevLesson } from '@/curriculum/structure';
import { useProgressStore } from '@/store/progressStore';

interface LessonContentProps {
  day: string;
  module: string;
  lesson: string;
}

/** MDX bileşenlerine enjekte edilen global component map */
const mdxComponents = {
  RunnableBlock,
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="text-2xl font-bold text-text mt-6 mb-3" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="text-lg font-semibold text-accent mt-5 mb-2" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="text-base font-semibold text-text mt-4 mb-1" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-text leading-relaxed mb-3" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc list-inside text-text mb-3 space-y-1 ml-2" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal list-inside text-text mb-3 space-y-1 ml-2" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="text-text leading-relaxed" {...props} />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code className="bg-surface px-1.5 py-0.5 rounded text-accent font-mono text-sm" {...props} />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="bg-surface rounded-lg p-4 overflow-x-auto mb-4 text-sm font-mono text-text" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-4 border-primary pl-4 py-1 my-3 text-text-muted italic" {...props} />
  ),
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse" {...props} />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-3 py-2 text-left text-text-muted bg-surface border-b border-border font-medium" {...props} />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-3 py-2 text-text border-b border-border" {...props} />
  ),
  hr: () => <hr className="border-border my-6" />,
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="text-text font-semibold" {...props} />
  ),
};

/** Tüm MDX dosyalarını lazy load için glob */
const mdxGlob = import.meta.glob<{ default: ComponentType }>('../../content/**/*.mdx');

/** MDX dosya adı haritası: lesson slug → filename (uzantısız) */
const LESSON_FILENAME: Record<string, Record<string, string>> = {
  'module-1': {
    'lesson-1': 'lesson-1-welcome',
    'lesson-2': 'lesson-2-pglite-postgresql-postgis',
    'lesson-3': 'lesson-3-cbs-vector-raster',
    'lesson-4': 'lesson-4-first-map',
  },
  'module-2': {
    'lesson-1': 'lesson-1-geometry-types',
    'lesson-2': 'lesson-2-multi-and-collection',
    'lesson-3': 'lesson-3-wkt-ewkt-geojson',
    'lesson-4': 'lesson-4-geometry-constructors',
    'lesson-5': 'lesson-5-geometry-metadata',
    'lesson-6': 'lesson-6-valid-geometry',
  },
};

function buildGlobKey(day: string, mod: string, lesson: string): string {
  const modMap = LESSON_FILENAME[mod] ?? {};
  const filename = modMap[lesson] ?? lesson;
  return `../../content/${day}/${mod}/${filename}.mdx`;
}

export default function LessonContent({ day, module, lesson }: LessonContentProps) {
  const meta = getLessonByRoute(day.replace('day-', ''), module.replace('module-', ''), lesson);
  const markComplete = useProgressStore((s) => s.markComplete);
  const isComplete = useProgressStore((s) => s.isComplete);

  const [MdxComponent, setMdxComponent] = useState<ComponentType | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setMdxComponent(null);
    setLoadError(null);

    const key = buildGlobKey(day, module, lesson);
    const loader = mdxGlob[key];

    if (!loader) {
      setLoadError(`MDX dosyası bulunamadı: ${key}`);
      return;
    }

    loader()
      .then((mod) => setMdxComponent(() => mod.default))
      .catch((e: unknown) => setLoadError(String(e)));
  }, [day, module, lesson]);

  const lessonId = meta?.id ?? `${day}-${module}-${lesson}`;
  const completed = isComplete(lessonId);

  const next = meta ? getNextLesson(meta) : null;
  const prev = meta ? getPrevLesson(meta) : null;

  return (
    <div className="p-6 max-w-none">
      {/* Başlık */}
      {meta && (
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
            <span>Gün {meta.day}</span>
            <span>·</span>
            <span>Modül {meta.module}</span>
            <span>·</span>
            <span>{meta.estimatedMinutes} dk</span>
            <span>·</span>
            <span className="px-1.5 py-0.5 rounded bg-primary text-accent text-xs">{meta.level}</span>
          </div>
          <h1 className="text-xl font-bold text-text">{meta.title}</h1>
        </div>
      )}

      {/* İçerik */}
      {loadError ? (
        <div className="p-4 rounded bg-red-950 text-red-300 text-sm font-mono">{loadError}</div>
      ) : MdxComponent ? (
        <Suspense fallback={<div className="text-text-muted text-sm">Yükleniyor…</div>}>
          <MdxComponent components={mdxComponents as never} />
        </Suspense>
      ) : (
        <div className="text-text-muted text-sm">Yükleniyor…</div>
      )}

      {/* Navigasyon + Tamamla butonu */}
      {meta && (
        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-4">
          {prev ? (
            <Link
              to={`/lesson/day-${prev.day}/module-${prev.module}/${prev.slug}`}
              className="text-sm text-text-muted hover:text-text"
            >
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}

          <button
            onClick={() => markComplete(lessonId)}
            disabled={completed}
            className="shrink-0 px-4 py-2 rounded bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm transition-colors"
          >
            {completed ? '✅ Tamamlandı' : 'Dersi Tamamla'}
          </button>

          {next ? (
            <Link
              to={`/lesson/day-${next.day}/module-${next.module}/${next.slug}`}
              className="text-sm text-accent hover:underline"
            >
              {next.title} →
            </Link>
          ) : (
            <span className="text-xs text-text-muted">Son ders</span>
          )}
        </div>
      )}
    </div>
  );
}
