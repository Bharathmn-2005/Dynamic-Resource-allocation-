import { NavLink, Outlet } from 'react-router-dom';
import { User, KeyRound } from 'lucide-react';
import { cn } from '../utils/classNames';

const LINKS = [
  { to: '/account', label: 'Profile', icon: <User size={16} />, end: true },
  { to: '/account/change-password', label: 'Change password', icon: <KeyRound size={16} /> },
];

export function AccountLayout() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Account</h1>
        <p className="mt-1 text-sm text-slate-500">Manage your profile and security settings.</p>
      </div>
      <div className="flex flex-col gap-6 md:flex-row">
        <nav className="flex w-full flex-col gap-1 md:w-56 shrink-0">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                )
              }
            >
              {l.icon} {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}