import { Link } from 'react-router-dom';
import { TrainFront, Home } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-card">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-900 text-white">
          <TrainFront size={22} />
        </div>
        <h1 className="mt-4 text-3xl font-extrabold text-slate-900">404</h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Home size={16} /> Back to home
          </Link>
          <Link to="/search" className="text-center text-sm font-medium text-blue-600 hover:underline">
            Search trains
          </Link>
        </div>
      </div>
    </div>
  );
}