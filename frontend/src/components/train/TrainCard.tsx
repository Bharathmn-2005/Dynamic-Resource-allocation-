import { Link } from 'react-router-dom';
import { ArrowRight, Armchair, MapPinned } from 'lucide-react';
import type { TrainSearchResult } from '../../types/train';
import { cn } from '../../utils/classNames';

export function TrainCard({ train, className }: { train: TrainSearchResult; className?: string }) {
  const hasSeatInfo = typeof train.seatAvailability === 'number';

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover',
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPinned size={16} />
            <span className="font-semibold text-brand-900">#{train.trainNumber}</span>
          </div>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {train.source} → {train.destination}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {train.journeyDate} · {train.trainType ?? 'Train'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">{train.currentStatus ?? 'Status unavailable'}</p>
          <p className="text-xs text-slate-500">{train.confirmationStatus ?? 'N/A'}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Source</p>
          <p className="font-medium text-slate-800">{train.source}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Destination</p>
          <p className="font-medium text-slate-800">{train.destination}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Travel</p>
          <p className="font-medium text-slate-800">
            {train.travelDistance != null ? `${train.travelDistance} km` : 'Distance N/A'}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          <Armchair size={15} />
          <span className={hasSeatInfo && train.seatAvailability! > 20 ? 'text-green-700' : 'text-slate-700'}>
            {hasSeatInfo ? `${train.seatAvailability} seats available` : 'Seat count unavailable'}
          </span>
        </span>
        {train.travelTime != null && <span className="text-xs text-slate-400">{train.travelTime} min</span>}
      </div>

      <div className="mt-4 flex items-center justify-between">
        {train.bookable && train.bookableTrainId ? (
          <Link
            to={`/train/${train.bookableTrainId}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Book now <ArrowRight size={15} />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            Search-only result
          </div>
        )}

        {train.bookable ? (
          <span className="text-xs text-green-700">Bookable via PostgreSQL train #{train.bookableTrainId}</span>
        ) : (
          <span className="text-xs text-slate-500">No matching bookable train exists</span>
        )}
      </div>
    </div>
  );
}
