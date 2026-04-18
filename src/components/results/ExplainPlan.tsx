import { useState, useCallback } from 'react';
import { executeQuery } from '@/pglite/client';
import { useEditorStore } from '@/store/editorStore';

export default function ExplainPlan() {
  const sql = useEditorStore((s) => s.sql);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExplain = useCallback(async () => {
    const query = sql.trim();
    if (!query) return;

    // Sadece SELECT tipi sorgular için EXPLAIN çalıştır
    if (!query.toUpperCase().startsWith('SELECT') && !query.toUpperCase().startsWith('WITH')) {
      setPlan('EXPLAIN ANALYZE sadece SELECT / WITH sorguları için çalışır.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await executeQuery(`EXPLAIN ANALYZE ${query}`);
      const lines = result.rows.map((r) => Object.values(r)[0] ?? '').join('\n');
      setPlan(String(lines));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [sql]);

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border shrink-0 flex items-center gap-2">
        <button
          onClick={handleExplain}
          disabled={loading}
          className="px-3 py-1 rounded bg-primary hover:bg-primary-light text-white text-xs transition-colors disabled:opacity-50"
        >
          {loading ? 'Çalışıyor…' : 'EXPLAIN ANALYZE'}
        </button>
        <span className="text-xs text-text-muted">Editördeki sorguyu analiz eder</span>
      </div>
      <div className="flex-1 overflow-auto p-3">
        {error && <div className="text-red-400 text-xs font-mono">{error}</div>}
        {plan && (
          <pre className="text-xs font-mono text-text whitespace-pre-wrap leading-relaxed">{plan}</pre>
        )}
        {!plan && !error && (
          <p className="text-text-muted text-sm">
            EXPLAIN ANALYZE butonuna bas — editördeki sorgunun çalışma planını göreceksin.
          </p>
        )}
      </div>
    </div>
  );
}
