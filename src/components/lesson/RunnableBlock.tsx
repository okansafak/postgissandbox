import { useEditorStore } from '@/store/editorStore';

interface RunnableBlockProps {
  sql: string;
  /** Çalıştırıldığında haritayı otomatik fit et */
  autoFit?: boolean;
  label?: string;
}

/** MDX içinde kullanılan çalıştırılabilir SQL bloğu.
 *  Tıklanınca SQL'i editöre yükler. */
export default function RunnableBlock({ sql, label = 'Editöre Yükle ve Çalıştır' }: RunnableBlockProps) {
  const setSql = useEditorStore((s) => s.setSql);

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      <pre className="p-4 bg-surface-2 text-sm font-mono text-text overflow-x-auto m-0">
        <code>{sql.trim()}</code>
      </pre>
      <div className="px-4 py-2 bg-surface border-t border-border flex items-center justify-between">
        <span className="text-xs text-text-muted">SQL</span>
        <button
          onClick={() => setSql(sql.trim())}
          className="text-xs px-3 py-1.5 rounded bg-primary hover:bg-primary-light text-white transition-colors"
        >
          ▶ {label}
        </button>
      </div>
    </div>
  );
}
