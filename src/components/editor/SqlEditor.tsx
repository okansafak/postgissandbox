import { useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { useEditorStore } from '@/store/editorStore';
import { executeQuery } from '@/pglite/client';
import { useMapStore } from '@/store/mapStore';
import { resultToGeoJSON, detectGeometryColumns } from '@/pglite/geojson-adapter';

export default function SqlEditor() {
  const { sql: currentSql, setSql, setResult, setError, setRunning, isRunning } = useEditorStore();
  const addLayer = useMapStore((s) => s.addLayer);

  const sqlValue = currentSql;

  const handleRun = useCallback(async () => {
    const query = sqlValue.trim();
    if (!query || isRunning) return;

    setRunning(true);
    setError(null);

    try {
      const result = await executeQuery(query);
      setResult(result);

      // Geometry sütunu varsa haritaya ekle
      const geomCols = detectGeometryColumns(result.fields, result.rows[0] ?? null);
      if (geomCols.length > 0 && result.rows.length > 0) {
        const geojson = await resultToGeoJSON(result.rows, geomCols, query);
        if (geojson.features.length > 0) {
          addLayer({ id: Date.now().toString(), geojson, label: 'Sorgu sonucu' });
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }, [sqlValue, isRunning, setRunning, setError, setResult, addLayer]);

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Araç çubuğu */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border shrink-0">
        <span className="text-xs text-text-muted font-mono">SQL Editörü</span>
        <div className="flex-1" />
        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary hover:bg-primary-light disabled:opacity-50 text-white text-sm transition-colors"
        >
          {isRunning ? '⏳ Çalışıyor…' : '▶ Çalıştır'}
        </button>
        <button
          onClick={() => setSql('')}
          className="px-2 py-1.5 rounded border border-border text-xs text-text-muted hover:text-text transition-colors"
          title="Editörü temizle"
        >
          Temizle
        </button>
      </div>

      {/* CodeMirror editörü */}
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={sqlValue}
          height="100%"
          theme={oneDark}
          extensions={[sql()]}
          onChange={(val) => setSql(val)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              void handleRun();
            }
          }}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            autocompletion: true,
          }}
          style={{ height: '100%', fontSize: '13px' }}
        />
      </div>

      {/* Hata gösterimi */}
      <ErrorBar />
    </div>
  );
}

function ErrorBar() {
  const error = useEditorStore((s) => s.error);
  if (!error) return null;
  return (
    <div className="px-3 py-2 bg-red-950 border-t border-red-800 text-red-300 text-xs font-mono shrink-0 max-h-24 overflow-y-auto">
      ❌ {error}
    </div>
  );
}
