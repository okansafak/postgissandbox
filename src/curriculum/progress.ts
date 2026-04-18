/** localStorage progress yardımcıları — Zustand persist middleware tarafından yönetilir.
 *  Bu dosya sadece ham okuma/yazma için düşük seviyeli bir API sunar. */

const KEY = 'postgis-akademi-progress';

export function getRawProgress(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { state?: { completedLessons?: string[] } };
    return parsed?.state?.completedLessons ?? [];
  } catch {
    return [];
  }
}
