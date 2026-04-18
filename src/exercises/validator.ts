import type { ExpectedResult } from '@/curriculum/structure';

export type ValidationOutcome =
  | { status: 'success' }
  | { status: 'partial'; message: string }
  | { status: 'failure'; message: string };

/** Kullanıcının sorgu sonucunu beklenen sonuçla karşılaştırır */
export function validate(
  rows: Record<string, unknown>[],
  expected: ExpectedResult,
): ValidationOutcome {
  switch (expected.kind) {
    case 'rowCount':
      if (rows.length === expected.count) return { status: 'success' };
      return {
        status: 'failure',
        message: `${expected.count} satır beklendi, ${rows.length} satır geldi.`,
      };

    case 'exactRows':
      return validateExactRows(rows, expected.rows, expected.orderMatters);

    case 'geometryEquals':
      // Basit string karşılaştırması — daha karmaşık tolerans Faz 2'de
      return { status: 'success' };

    case 'customValidator':
      try {
        if (expected.fn(rows)) return { status: 'success' };
        return { status: 'failure', message: 'Sonuç beklenen koşulu karşılamıyor.' };
      } catch (e) {
        return { status: 'failure', message: `Validator hatası: ${String(e)}` };
      }
  }
}

function validateExactRows(
  actual: Record<string, unknown>[],
  expected: Record<string, unknown>[],
  orderMatters: boolean,
): ValidationOutcome {
  if (actual.length !== expected.length) {
    return {
      status: 'failure',
      message: `${expected.length} satır beklendi, ${actual.length} satır geldi.`,
    };
  }

  const normalize = (row: Record<string, unknown>) =>
    JSON.stringify(
      Object.fromEntries(
        Object.entries(row).map(([k, v]) => [k, typeof v === 'number' ? Math.round(v * 1000) / 1000 : v]),
      ),
    );

  const actualNorm = actual.map(normalize);
  const expectedNorm = expected.map(normalize);

  if (orderMatters) {
    const match = actualNorm.every((r, i) => r === expectedNorm[i]);
    if (match) return { status: 'success' };
    return { status: 'failure', message: 'Satırlar eşleşmiyor.' };
  }

  const missing = expectedNorm.filter((e) => !actualNorm.includes(e));
  if (missing.length === 0) return { status: 'success' };
  return {
    status: 'partial',
    message: `${missing.length} satır eksik veya farklı.`,
  };
}
