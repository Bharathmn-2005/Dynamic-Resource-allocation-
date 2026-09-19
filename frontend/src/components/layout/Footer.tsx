import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Logo } from '../ui/logo';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-brand-900 py-10 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5">
          <Logo />
          <div>
            <p className="text-sm font-semibold text-white">RailVoyage</p>
            <p className="text-xs text-slate-400">Reliable train journeys across India.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <ShieldCheck className="text-accent-500" size={16} />
          <span className="text-slate-400">Secure payments via sandbox gateway</span>
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} RailVoyage</p>
      </div>
    </footer>
  );
}