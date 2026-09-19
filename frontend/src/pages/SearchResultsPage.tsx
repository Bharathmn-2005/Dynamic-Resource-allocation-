import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrainFrontTunnel } from 'lucide-react';
import { useSearch } from '../features/trains/search.context';
import { TrainCard } from '../components/train/TrainCard';
import { SearchForm } from '../components/search/SearchForm';
import { EmptyState, ErrorState, Skeleton } from '../components/ui/feedback';
import { fmt } from '../utils/formatters';

export function SearchResultsPage() {
  const { query, results, loading, error, search } = useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      navigate('/', { replace: true });
    }
  }, [query, navigate]);

  if (!query) {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs text-slate-500">Showing trains</p>
            <p className="text-lg font-semibold text-slate-900 text-capitalize">
              {query.source} <span className="text-slate-400">→</span> {query.destination}
            </p>
          </div>
          <div className="ml-auto rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            {fmt.date(query.journeyDate)}
          </div>
        </div>
        <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
          <summary className="cursor-pointer text-sm font-medium text-slate-700">Modify search</summary>
          <div className="mt-2">
            <SearchForm compact onSubmitting={() => undefined} />
          </div>
        </details>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap gap-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="mt-4 grid grid-cols-[1fr_auto_1fr] gap-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <ErrorState
            title="We could not search trains"
            message={error}
            onRetry={() => query && search(query)}
          />
        ) : results.length === 0 ? (
          <EmptyState
            icon={<TrainFrontTunnel size={22} />}
            title="No trains found"
            description={`We could not find trains between ${query.source} and ${query.destination}. Try a nearby station or another date.`}
            action={
              <Link
                to="/"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                New search
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-4">
            {results.map((train) => (
              <TrainCard key={train.id} train={train} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}