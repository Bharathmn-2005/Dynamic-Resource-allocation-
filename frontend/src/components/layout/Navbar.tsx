import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogIn, UserPlus, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../features/auth/auth.context';
import { Logo } from '../ui/logo';
import { cn } from '../../utils/classNames';

const NAV_LINKS = [
  { to: '/', label: 'Search Trains' },
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  const { isAuthenticated } = useAuth();
  return (
    <>
      {NAV_LINKS.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            )
          }
        >
          {l.label}
        </NavLink>
      ))}
      {isAuthenticated ? (
        <NavLink
          to="/my-bookings"
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
            )
          }
        >
          My Bookings
        </NavLink>
      ) : null}
    </>
  );
}

function AuthButtons({ onNavigate }: { onNavigate?: () => void }) {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <span className="rounded-lg px-3 py-2 text-sm text-slate-400">Loading account…</span>;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/login"
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          <LogIn size={16} /> Log in
        </Link>
        <Link
          to="/register"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700"
        >
          <UserPlus size={16} /> Sign up
        </Link>
      </div>
    );
  }

  const displayName = user?.username ?? user?.email?.split('@')[0] ?? 'My account';

  return (
    <div className="flex items-center gap-1">
      <span
        className="flex max-w-[180px] items-center gap-1.5 truncate rounded-lg px-3 py-2 text-sm font-semibold text-slate-800"
        title={user?.email}
      >
        <UserCircle size={18} className="shrink-0 text-blue-600" />
        <span className="truncate">{displayName}</span>
      </span>
      <NavLink
        to="/account"
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
            isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          )
        }
      >
        Profile
      </NavLink>
      <button
        onClick={() => logout().then(() => navigate('/'))}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <NavItems />
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <AuthButtons />
        </div>

        {/* Mobile menu */}
        <div className="lg:hidden">
          <button
            aria-label="Toggle menu"
            className="rounded-md p-2 text-slate-700 hover:bg-slate-100"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          {open ? (
            <div className="absolute inset-x-0 top-full z-50 border-b border-slate-200 bg-white p-4 shadow-lg">
              <div className="flex flex-col gap-1">
                <NavItems onNavigate={() => setOpen(false)} />
                {isLoading ? (
                  <span className="mt-2 rounded-md px-3 py-2 text-sm text-slate-400">
                    Loading account…
                  </span>
                ) : isAuthenticated ? (
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout().then(() => navigate('/'));
                    }}
                    className="flex items-center gap-1.5 rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Log out
                  </button>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
