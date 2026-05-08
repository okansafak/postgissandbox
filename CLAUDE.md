# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Run from `postgis-akademi/`:

```bash
npm run dev       # Vite dev server at http://localhost:5173 (HMR)
npm run build     # tsc -b && vite build → dist/
npm run lint      # ESLint flat config
npm run preview   # Static preview of dist/
```

No test runner is wired up yet (Vitest is in dependencies but has no config or test files).

## Architecture

### Zero-Backend, Browser-Only

PGlite (PostgreSQL compiled to WASM) runs entirely in the browser, persisting to IndexedDB at `idb://postgis-akademi`. No server exists. The app is deployable as a static site.

### Web Worker Message Protocol

PGlite runs in `src/pglite/worker.ts` to avoid blocking the UI. The protocol is a discriminated union:

- Request: `{ id: string, kind: 'query' | 'exec' | 'ping', sql?: string }`
- Response: `{ id: string, ok: boolean, rows?, fields?, durationMs?, error? }`

The UI thread (`src/pglite/client.ts`) tracks in-flight requests by UUID with a 30-second timeout. Workers are imported via Vite's `?worker` syntax: `import DbWorker from './worker?worker'`. The startup handshake uses the sentinel ID `__init__`.

### Geometry Auto-Detection and CTE Wrapping

`src/pglite/geojson-adapter.ts` transparently converts geometry query results for the map without modifying user-visible SQL. When geometry columns are detected (by field OID range 17001–17003 or value inspection), the adapter silently re-executes the query wrapped in a CTE:

```sql
WITH __user_query AS (<sanitized user sql>)
SELECT *, ST_AsGeoJSON(ST_Transform(geom, 4326)) AS __geojson
FROM __user_query
```

The wrapper always reprojects to EPSG:4326 before display. If the wrapper query fails, it falls back gracefully. SQL passed to the adapter must have trailing semicolons and comments stripped first (the adapter handles this).

### Vite Critical Notes

- The MDX rollup plugin **must** have `enforce: 'pre'` in `vite.config.ts`; without it, Vite processes MDX files before the plugin can handle them.
- `@electric-sql/pglite` and `@electric-sql/pglite-postgis` are excluded from `optimizeDeps` because they are native ES modules (WASM).
- Web Worker output format must be `'es'` for ES module syntax to work in workers.
- The `/sunum/` path is served via a custom Vite middleware from `sunum/` directory and copied to `dist/sunum/` on build.

### TypeScript Strict Flags

Build fails on violations of: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters`. Common traps:
- Array index access (`arr[i]`) returns `T | undefined` — always guard.
- Optional property `foo?: string` is not assignable to `foo: string | undefined` with `exactOptionalPropertyTypes`.
- Path alias `@/` → `src/` is configured in both `tsconfig.app.json` and `vite.config.ts`.

## Key Patterns

### Adding a New Lesson

Two files must stay in sync:
1. Create the MDX file at `src/content/day-{N}/module-{N}/lesson-{slug}.mdx`
2. Add the `Lesson` entry to the `CURRICULUM` array in `src/curriculum/structure.ts`

`structure.ts` also owns `MODULE_META` (module titles and durations). Module display numbering differs from actual module numbers — see `getModuleDisplayNumber()` and `getActualModuleNumber()` in that file if adding modules across days.

### Interactive SQL Blocks in MDX

Use `<RunnableBlock sql={...} label="..." description="..." />` in MDX files. Clicking "Run" calls `setSql()` on `editorStore`, loading the SQL into the editor — it does not auto-execute. The `description` prop is hidden behind a toggle button.

### State Stores

Three focused Zustand stores in `src/store/`:
- `editorStore`: `sql`, `result`, `error`, `isRunning` — single source of truth for the editor/query cycle
- `mapStore`: `layers` array (one layer per query result, replaced not appended), `shouldFit` trigger for auto-zoom
- `progressStore`: `completedLessons` string array, persisted to `localStorage` key `postgis-akademi-progress`

### Exercise Validation

`src/exercises/validator.ts` validates query results against `Exercise.expectedResult`, which supports: `rowCount`, `exactRows`, `geometryEquals`, `customValidator`. See `src/exercises/comparators.ts` for the row-comparison logic.

## PGlite / PostGIS Limitations

PGlite's PostGIS extension does not implement the full PostgreSQL PostGIS feature set. Functions that are missing or behave differently will silently fail or error at runtime — not at build time. Unsupported features (pgRouting, postgis_topology, streaming replication) must be handled with conceptual explanations or diagrams, not live queries.

## Language

All user-facing UI text and lesson content is Turkish.
