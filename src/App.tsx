import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';
import Lesson from '@/pages/Lesson';
import Playground from '@/pages/Playground';
import { initDb } from '@/pglite/client';

// Worker'ı uygulama yüklenirken başlat (lazy değil, erken init)
initDb();

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lesson/:day/:module/:lesson" element={<Lesson />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
