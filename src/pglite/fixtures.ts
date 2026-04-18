/** Ders başlangıç fixture'ları — ders açılırken PGlite'a yüklenir */

export interface Fixture {
  lessonId: string;
  sql: string;
}

export const FIXTURES: Fixture[] = [
  // Modül 1.1 için fixture gerekmez — temel SELECT/ST_MakePoint yeterli
];
