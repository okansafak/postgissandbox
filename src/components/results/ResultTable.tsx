import { useEditorStore } from '@/store/editorStore';

export default function ResultTable() {
  const { result, error, isRunning } = useEditorStore();

  if (isRunning) {
    return <div className="p-4 text-text-muted text-sm">Sorgu çalışıyor…</div>;
  }
  if (error) {
    return <div className="p-4 text-red-400 text-sm font-mono">Hata: {error}</div>;
  }
  if (!result) {
    return (
      <div className="p-4 text-text-muted text-sm">
        Sonuç burada görünecek. SQL yazıp Çalıştır'a bas.
      </div>
    );
  }
  if (result.rows.length === 0) {
    return (
      <div className="p-4 text-text-muted text-sm">
        Sorgu başarılı ama 0 satır döndü. ({result.durationMs} ms)
      </div>
    );
  }

  const cols = result.fields.map((f) => f.name);

  return (
    <div className="text-sm">
      <div className="px-3 py-1.5 text-xs text-text-muted border-b border-border">
        {result.rows.length} satır · {result.durationMs} ms
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr className="bg-surface">
              {cols.map((col) => (
                <th key={col} className="px-3 py-2 text-left text-text-muted border-b border-border whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.slice(0, 1000).map((row, i) => (
              <tr key={i} className="border-b border-border hover:bg-surface">
                {cols.map((col) => (
                  <td key={col} className="px-3 py-1.5 text-text max-w-64 truncate">
                    {formatCell(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {result.rows.length > 1000 && (
          <div className="px-3 py-2 text-xs text-text-muted">
            İlk 1000 satır gösteriliyor (toplam {result.rows.length})
          </div>
        )}
      </div>
    </div>
  );
}

function formatCell(val: unknown): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'object') return JSON.stringify(val).slice(0, 200);
  return String(val).slice(0, 200);
}
