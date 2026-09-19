import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CalendarSearch, ShieldCheck, Ticket, Wallet } from 'lucide-react';
import { SearchForm } from '../components/search/SearchForm';

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Search journeys',
    description: 'Pick your source, destination and travel date to see live trains with fares and availability.',
  },
  {
    step: '02',
    title: 'Review & book',
    description: 'Enter traveller details, choose your train and confirm your seat instantly.',
  },
  {
    step: '03',
    title: 'Pay securely',
    description: 'Complete the sandbox checkout and keep every booking safely in your account.',
  },
];

const PERKS = [
  { icon: <ShieldCheck size={20} />, title: 'Secure payments', text: 'Sandbox checkout with no sensitive card data stored by us.' },
  { icon: <BadgeCheck size={20} />, title: 'Instant confirmations', text: 'Get a PNR and seat number the moment your booking is created.' },
  { icon: <Ticket size={20} />, title: 'Live availability', text: 'Accurate seat availability read from the live train service.' },
];

export function LandingPage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(217,129,8,0.7) 0, transparent 45%),' +
              'radial-gradient(circle at 80% 30%, rgba(29,78,216,0.6) 0, transparent 50%),' +
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-amber-100 ring-1 ring-white/20">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping" />
                India's smoothest way to book trains
              </p>
              <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
                Search, compare and book{' '}
                <span className="text-accent-500">train tickets</span> in seconds.
              </h1>
              <p className="mt-4 max-w-xl text-base text-slate-200 sm:text-lg">
                RailVoyage brings real schedules, live seats and secure sandbox payments into one
                simple, beautifully designed journey.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#search"
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-900 hover:bg-amber-50"
                >
                  Start searching <ArrowRight size={16} />
                </a>
                <Link
                  to="/my-bookings"
                  className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white ring-1 ring-white/30 hover:bg-white/10"
                >
                  My bookings
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <svg viewBox="0 0 400 300" className="mx-auto w-full max-w-md" role="img" aria-label="Stylised illustration of a train crossing a scenic bridge at dusk">
                <rect width="400" height="300" rx="24" fill="#0b1f35" />
                <circle cx="330" cy="60" r="32" fill="#fbbf24" />
                <path d="M0 220 Q150 200 300 210 L400 190 L400 300 L0 300 Z" fill="#112e4b" />
                <path d="M20 210 Q180 215 300 200 L380 205 L380 300 L20 300 Z" fill="#0b1f35" />
                <g transform="translate(40,120)">
                  <rect width="300" height="42" rx="8" fill="#ea580c" />
                  <rect x="10" y="8" width="34" height="26" rx="4" fill="#ffd9b3" />
                  <rect x="96" y="8" width="34" height="26" rx="4" fill="#ffd9b3" />
                  <rect x="0" y="42" width="300" height="12" rx="4" fill="#d4a35c" />
                  <circle cx="30" cy="58" r="10" fill="#0b1f35" />
                  <circle cx="160" cy="58" r="10" fill="#0b1f35" />
                  <circle cx="270" cy="58" r="10" fill="#0b1f35" />
                </g>
              </svg>
            </div>
          </div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div id="search" className="rounded-2xl border border-white/15 bg-brand-900/40 p-6 backdrop-blur">
            <SearchForm />
          </div>
        </div>
      </section>
{/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900">Booking in three simple steps</h2>
          <p className="mt-2 text-sm text-slate-500">
            From search to seat in under a minute — no calls, no queues.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {HOW_IT_WORKS.map((c) => (
            <div key={c.step} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  {c.step}
                </span>
                <h3 className="text-base font-semibold text-slate-900">{c.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Perks */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-slate-900">Built for reliable journeys</h2>
          <p className="mt-2 text-sm text-slate-500">
            Everything you expect from a modern travel platform — and nothing you do not.
          </p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {PERKS.map((p) => (
            <div key={p.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                {p.icon}
              </div>
              <h3 className="mt-3 text-base font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-1.5 text-sm text-slate-500">{p.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}