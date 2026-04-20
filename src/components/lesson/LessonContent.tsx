import { Suspense, useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import RunnableBlock from './RunnableBlock';
import { getLessonByRoute, getLessonRoute, getModuleDisplayNumber, getNextLesson, getPrevLesson } from '@/curriculum/structure';
import { useProgressStore } from '@/store/progressStore';
import { ArrowLeft } from '@/components/ui/Icons';

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

/** MDX dosya adı haritası: "day-N/module-N" → lesson slug → filename */
const LESSON_FILENAME: Record<string, Record<string, string>> = {
  'day-1/module-0': {
    'lesson-1': 'lesson-1-cluster-database-schema',
    'lesson-2': 'lesson-2-tablespace',
    'lesson-3': 'lesson-3-mvcc-transaction',
    'lesson-4': 'lesson-4-isolation-locks',
  },
  'day-1/module-1': {
    'lesson-1': 'lesson-1-welcome',
    'lesson-2': 'lesson-2-pglite-postgresql-postgis',
    'lesson-3': 'lesson-3-cbs-vector-raster',
    'lesson-4': 'lesson-4-first-map',
    'lesson-5': 'lesson-5-postgis-reference',
  },
  'day-1/module-2': {
    'lesson-1': 'lesson-1-geometry-types',
    'lesson-2': 'lesson-2-multi-and-collection',
    'lesson-3': 'lesson-3-wkt-ewkt-geojson',
    'lesson-4': 'lesson-4-geometry-constructors',
    'lesson-5': 'lesson-5-geometry-metadata',
    'lesson-6': 'lesson-6-valid-geometry',
  },
  'day-1/module-3': {
    'lesson-1': 'lesson-1-why-projections',
    'lesson-2': 'lesson-2-srid-epsg',
    'lesson-3': 'lesson-3-geometry-vs-geography',
    'lesson-4': 'lesson-4-setsrid-vs-transform',
    'lesson-5': 'lesson-5-turkey-epsg',
    'lesson-6': 'lesson-6-projection-decision',
  },
  'day-1/module-4': {
    'lesson-1': 'lesson-1-contains-within',
    'lesson-2': 'lesson-2-intersects-disjoint',
    'lesson-3': 'lesson-3-touches-crosses-overlaps',
    'lesson-4': 'lesson-4-dwithin',
    'lesson-5': 'lesson-5-spatial-join',
  },
  'day-1/module-5': {
    'lesson-1': 'lesson-1-distance',
    'lesson-2': 'lesson-2-area-length',
    'lesson-3': 'lesson-3-centroid',
    'lesson-4': 'lesson-4-buffer',
    'lesson-5': 'lesson-5-set-operations',
    'lesson-6': 'lesson-6-envelope-hull',
    'lesson-7': 'lesson-7-knn',
  },
  'day-2/module-1': {
    'lesson-1': 'lesson-1-csv-import',
    'lesson-2': 'lesson-2-geojson-load',
    'lesson-3': 'lesson-3-staging-pattern',
    'lesson-4': 'lesson-4-bulk-transform',
    'lesson-5': 'lesson-5-ogr2ogr',
  },
  'day-2/module-2': {
    'lesson-1': 'lesson-1-simplify',
    'lesson-2': 'lesson-2-subdivide',
    'lesson-3': 'lesson-3-linear-referencing',
    'lesson-4': 'lesson-4-closest-point',
    'lesson-5': 'lesson-5-azimuth',
  },
  'day-2/module-3': {
    'lesson-1': 'lesson-1-why-index',
    'lesson-2': 'lesson-2-create-gist',
    'lesson-3': 'lesson-3-spgist',
    'lesson-4': 'lesson-4-bbox-operator',
    'lesson-5': 'lesson-5-partial-functional-index',
    'lesson-6': 'lesson-6-pg-stat-indexes',
    'lesson-7': 'lesson-7-analyze',
  },
  'day-2/module-4': {
    'lesson-1': 'lesson-1-explain-analyze-basics',
    'lesson-2': 'lesson-2-seq-index-scan',
    'lesson-3': 'lesson-3-reading-cost-rows',
    'lesson-4': 'lesson-4-st-distance-antipattern',
    'lesson-5': 'lesson-5-function-in-where',
    'lesson-6': 'lesson-6-explain-json',
  },
  'day-2/module-5': {
    'lesson-1': 'lesson-1-vacuum-bloat',
    'lesson-2': 'lesson-2-range-partitioning',
    'lesson-3': 'lesson-3-list-partitioning',
    'lesson-4': 'lesson-4-partition-pruning',
    'lesson-5': 'lesson-5-tablespace-performance',
  },
  'day-3/module-1': {
    'lesson-1': 'lesson-1-clustering-intro',
    'lesson-2': 'lesson-2-st-clusterkmeans',
    'lesson-3': 'lesson-3-st-clusterdbscan',
    'lesson-4': 'lesson-4-hex-grid-density',
    'lesson-5': 'lesson-5-clustering-decision',
  },
  'day-3/module-2': {
    'lesson-1': 'lesson-1-network-basics',
    'lesson-2': 'lesson-2-network-topology',
    'lesson-3': 'lesson-3-dijkstra',
    'lesson-4': 'lesson-4-service-area',
    'lesson-5': 'lesson-5-tsp',
  },
  'day-3/module-3': {
    'lesson-1': 'lesson-1-topology-concept',
    'lesson-2': 'lesson-2-create-topology',
    'lesson-3': 'lesson-3-topology-advantage',
  },
  'day-3/module-4': {
    'lesson-1': 'lesson-1-role-grant',
    'lesson-2': 'lesson-2-rls-basics',
    'lesson-3': 'lesson-3-spatial-rls',
    'lesson-4': 'lesson-4-readonly-user',
  },
  'day-3/module-5': {
    'lesson-1': 'lesson-1-pg-dump-restore',
    'lesson-2': 'lesson-2-replication',
    'lesson-3': 'lesson-3-pitr',
    'lesson-4': 'lesson-4-pgbouncer',
    'lesson-5': 'lesson-5-monitoring',
  },
  'day-3/module-6': {
    'lesson-1': 'lesson-1-data-validation',
    'lesson-2': 'lesson-2-health-density',
    'lesson-3': 'lesson-3-unreachable-areas',
    'lesson-4': 'lesson-4-hotspot-analysis',
  },
};

function buildGlobKey(day: string, mod: string, lesson: string): string {
  const dayModKey = `${day}/${mod}`;
  const modMap = LESSON_FILENAME[dayModKey] ?? {};
  const filename = modMap[lesson] ?? lesson;
  return `../../content/${day}/${mod}/${filename}.mdx`;
}

export default function LessonContent({ day, module, lesson }: LessonContentProps) {
  const meta = getLessonByRoute(day.replace('day-', ''), module.replace('module-', ''), lesson);
  const markComplete = useProgressStore((s) => s.markComplete);
  const completedLessons = useProgressStore((s) => s.completedLessons);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [MdxComponent, setMdxComponent] = useState<ComponentType<Record<string, any>> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setMdxComponent(null);
    setLoadError(null);

    const mdxDay = meta ? `day-${meta.day}` : day;
    const mdxModule = meta ? `module-${meta.module}` : module;
    const key = buildGlobKey(mdxDay, mdxModule, lesson);
    const loader = mdxGlob[key];

    if (!loader) {
      setLoadError(`MDX dosyası bulunamadı: ${key}`);
      return;
    }

    loader()
      .then((mod) => setMdxComponent(() => mod.default))
      .catch((e: unknown) => setLoadError(String(e)));
  }, [day, module, lesson, meta]);

  const lessonId = meta?.id ?? `${day}-${module}-${lesson}`;
  const completed = completedLessons.includes(lessonId);

  const next = meta ? getNextLesson(meta) : null;
  const prev = meta ? getPrevLesson(meta) : null;

  return (
    <div className="p-6 max-w-none">
      {/* Başlık */}
      {meta && (
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
            <span>Bölüm {meta.day}</span>
            <span>·</span>
            <span>Modül {getModuleDisplayNumber(meta.day, meta.module)}</span>
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
              to={getLessonRoute(prev.day, prev.module, prev.slug)}
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text"
            >
              <ArrowLeft size={13} /> {prev.title}
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
              to={getLessonRoute(next.day, next.module, next.slug)}
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
