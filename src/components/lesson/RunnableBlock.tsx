import { useState } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { Play } from '@/components/ui/Icons';

interface RunnableBlockProps {
  sql: string;
  /** Çalıştırıldığında haritayı otomatik fit et */
  autoFit?: boolean;
  label?: string;
  /** SQL sorgusunun ne yaptığını açıklayan metin — "?" butonuyla gösterilir */
  description?: string;
}

/** MDX içinde kullanılan çalıştırılabilir SQL bloğu.
 *  Tıklanınca SQL'i editöre yükler. */
export default function RunnableBlock({ sql, label = 'Editöre Yükle ve Çalıştır', description }: RunnableBlockProps) {
  const setSql = useEditorStore((s) => s.setSql);
  const [showDesc, setShowDesc] = useState(false);

  return (
    <div className="my-4 rounded-lg border border-border overflow-hidden">
      <pre className="p-4 bg-surface-2 text-sm font-mono text-text overflow-x-auto m-0">
        <code>{sql.trim()}</code>
      </pre>
      <div className="px-4 py-2 bg-surface border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">SQL</span>
          {description !== undefined && (
            <button
              onClick={() => setShowDesc((v) => !v)}
              title="Sorgu açıklaması"
              className={`w-[18px] h-[18px] rounded-full border text-[10px] font-bold leading-none flex items-center justify-center transition-colors ${
                showDesc
                  ? 'bg-primary border-primary text-white'
                  : 'border-primary text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {showDesc ? '✓' : '?'}
            </button>
          )}
        </div>
        <button
          onClick={() => setSql(sql.trim())}
          className="text-xs px-3 py-1.5 rounded bg-primary hover:bg-primary-light text-white transition-colors"
        >
          <span className="flex items-center gap-1.5"><Play size={10} /> {label}</span>
        </button>
      </div>
      {description !== undefined && showDesc && (
        <div className="px-4 py-3 bg-blue-500/5 border-t border-blue-500/20 text-sm text-text-muted leading-relaxed">
          {description}
        </div>
      )}
    </div>
  );
}
