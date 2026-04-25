# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Run from this directory (`postgis-akademi/`):

```bash
npm run dev          # dev server at http://localhost:5173
npm run build        # tsc -b && vite build → dist/
npm run lint         # ESLint flat config
npm run preview      # static preview of dist/
```

No test runner is wired up yet (Vitest is a dependency but not configured).

## Architecture

### Zero-Backend, Browser-Only

PGlite (PostgreSQL compiled to WASM) runs in a dedicated Web Worker and persists data to IndexedDB (`idb://postgis-akademi`). The app has no server and is deployable as a static site.

`initDb()` is called eagerly at module load in `App.tsx` — not lazily — so the worker is always warming up on first render.

### Worker ↔ UI Protocol

`src/pglite/worker.ts` initializes PGlite + PostGIS extension, then handles messages. `src/pglite/client.ts` sends tagged requests and matches responses via a `Map<id, {resolve,reject}>`. Requests time out after 30 seconds.

**Important:** The worker uses `db.exec()` (not `db.query()`) for *both* `query` and `exec` message kinds. This is intentional — `exec()` supports multi-statement SQL and trailing comments. For `query` kind, it takes the last result set that has fields.

`postgis_topology` is loaded in the worker (`CREATE EXTENSION IF NOT EXISTS postgis_topology`), so topology functions are available in the sandbox even though the curriculum teaches them conceptually.

### Adding a New Lesson

When you add a new MDX file, you must also update the `LESSON_FILENAME` map in [src/components/lesson/LessonContent.tsx](src/components/lesson/LessonContent.tsx). This hardcoded map translates `lesson-N` route slugs to the actual MDX filename (e.g., `lesson-2` → `lesson-2-create-topology`). Missing entries cause a "MDX dosyası bulunamadı" error at runtime.

MDX files are loaded via `import.meta.glob('../../content/**/*.mdx')`. LessonContent first checks `LESSON_FILENAME` for the full filename, then falls back to the raw slug.

Lesson metadata (title, estimatedMinutes, level, tags, objectives) lives in `src/curriculum/structure.ts`. The sidebar, breadcrumbs, prev/next navigation, and exercise validation all derive from this file. `lessons.csv` in the project root is a reference/audit document only — it is **not** imported by any code.

### Module Numbering and Routing

`DAY_MODULE_SEQUENCE` in `structure.ts` defines the module order per day (e.g., day 1: `[1, 0, 2, 3, 4, 5]`). Module 0 is the PostgreSQL refresher shown as "Module 0" in the UI.

**Critical:** The URL segment `module-N` uses the **display number**, not the actual module index. `getModuleDisplayNumber(day, module)` converts actual → display; `getActualModuleNumber(day, display)` reverses it. Always use these helpers when building or parsing lesson routes.

### MDX Components

MDX files can use `<RunnableBlock sql="..." />`, which loads the SQL into the editor when the button is clicked — it does **not** auto-execute. Optional props:
- `description` — shows a toggleable explanation panel (blue background)
- `label` — custom button text (default: "Editöre Yükle ve Çalıştır")

The component map is defined in `LessonContent.tsx` (`mdxComponents`). Standard HTML elements (`h1`–`h3`, `p`, `ul`, `ol`, `code`, `pre`, `blockquote`, `table`, etc.) are overridden with Tailwind-styled versions.

### Geometry Auto-Detection

`src/pglite/geojson-adapter.ts` detects geometry columns in query results using:
1. A hardcoded set of OIDs (`17001`, `17002`, `17003` — typical PostGIS geometry OIDs in PGlite)
2. Value inspection fallback: strings that parse as GeoJSON or match hex WKB pattern

When geometry columns are detected, the adapter strips trailing semicolons/comments from the original SQL and wraps it in a CTE, selecting `ST_AsGeoJSON(ST_Transform(geom, 4326))` for each geometry column. Results render automatically in the OpenLayers map.

### Map (SpatialMap)

Default center is Turkey `[35, 39]` at zoom 5 with CARTO dark_all tiles. Auto-zoom uses `vectorSource.getExtent()` + `view.fit()` with 40 px padding, max zoom 16, and a 500 ms animation, triggered via `mapStore.shouldFit` / `fitHandled` flags. `mapStore.layers` is **replaced** (not appended) on each query that returns geometry.

### Exercise Validation

`src/exercises/validator.ts` supports four validation kinds defined in `src/curriculum/structure.ts`:
- `rowCount` — exact row count match
- `exactRows` — deep row comparison (numbers rounded to 3 decimals), with optional `orderMatters` flag
- `geometryEquals` — stub, always passes (Phase 2)
- `customValidator` — arbitrary `(rows) => boolean` function

### Per-Lesson Fixtures

`src/pglite/fixtures.ts` exports `FIXTURES: Fixture[]` for loading seed SQL when a lesson opens. Currently empty but the structure is in place.

### State

- `editorStore` — `sql`, `result`, `error`, `isRunning`; `STARTER_SQL` is the initial SELECT on app load; no persistence
- `mapStore` — `layers` (GeoJSON FeatureCollections), `shouldFit` / `fitHandled` flags for auto-zoom
- `progressStore` — `completedLessons: string[]`, persisted to `localStorage` under key `postgis-akademi-progress`

`CurriculumSidebar` persists its open/collapsed state to `localStorage` under keys `sidebar-open-days` and `sidebar-open-modules`. When a search query is active, all days and modules auto-expand.

### TypeScript

Strict mode with `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`. Build fails on violations. `Lesson.day` is a strict literal union `0|1|2|3`, not `number`.

### Vite Config

- PGlite packages excluded from esbuild optimization (`optimizeDeps.exclude`) — they are native ES modules
- `assetsInclude: ['**/*.tar.gz']` — required for the PostGIS WASM extension bundle
- Web Worker output format must be `'es'`
- MDX rollup plugin must run with `enforce: 'pre'`
- Path alias: `@` → `src/`

## Language

All user-facing text and lesson content must be in Turkish.
