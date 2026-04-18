import { create } from 'zustand';

export interface QueryField {
  name: string;
  dataTypeID: number;
}

export interface QueryResult {
  rows: Record<string, unknown>[];
  fields: QueryField[];
  durationMs: number;
}

interface EditorState {
  sql: string;
  result: QueryResult | null;
  error: string | null;
  isRunning: boolean;
  setSql: (sql: string) => void;
  setResult: (result: QueryResult) => void;
  setError: (error: string | null) => void;
  setRunning: (running: boolean) => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  sql: '',
  result: null,
  error: null,
  isRunning: false,
  setSql: (sql) => set({ sql }),
  setResult: (result) => set({ result, error: null }),
  setError: (error) => set({ error, result: null }),
  setRunning: (isRunning) => set({ isRunning }),
  reset: () => set({ sql: '', result: null, error: null, isRunning: false }),
}));
