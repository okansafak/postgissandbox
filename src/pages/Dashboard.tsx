import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8 text-center">
      <h1 className="text-3xl font-semibold text-accent">PostGIS Akademi</h1>
      <p className="text-text-muted max-w-md">
        Tarayıcıda çalışan, sunucusuz PostGIS öğrenme platformu.
        Sorgu yaz, haritada gör, adım adım öğren.
      </p>
      <Link
        to="/lesson/day-1/module-1/lesson-1"
        className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-light text-white font-medium transition-colors"
      >
        Gün 1'e Başla →
      </Link>
    </div>
  );
}
