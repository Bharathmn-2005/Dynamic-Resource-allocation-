import { Outlet } from 'react-router-dom';
import { LogoMark } from '../components/ui/logo';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="flex items-center justify-center px-4 py-4">
        <a href="/" className="flex items-center gap-2 text-slate-700 hover:text-slate-900">
          <LogoMark />
        </a>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}