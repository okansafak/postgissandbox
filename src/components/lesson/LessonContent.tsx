interface LessonContentProps {
  day: string;
  module: string;
  lesson: string;
}

/** MDX ders içeriğini render eder. Adım 3'te gerçek MDX dynamic import ile güncellenir. */
export default function LessonContent({ day, module, lesson }: LessonContentProps) {
  return (
    <div className="p-6 prose prose-invert max-w-none">
      <p className="text-text-muted text-sm font-mono">
        {day} / {module} / {lesson}
      </p>
      <h2 className="text-xl font-semibold text-text mt-2">İçerik yükleniyor…</h2>
      <p className="text-text-muted">
        MDX ders içeriği Adım 3'te bağlanacak.
      </p>
    </div>
  );
}
