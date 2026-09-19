import { Link } from 'react-router-dom';
import { Armchair, ChevronRight, Ticket } from 'lucide-react';
import type { TrainResponse } from '../../types/train';
import { TrainTypeBadge, TrainStatusBadge } from '../badges';
import { fmt } from '../../utils/formatters';
import { cn } from '../../utils/classNames';

export function TrainCard({ train, className }: { train: TrainResponse; className?: string }) {
  const seats = train.availableSeats ?? 0;

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
            <Ticket size={16} />
            <span className="font-semibold text-brand-900">#{fmt.trainNumber(train.trainNumber)}</span>
          </div>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{train.trainName}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <TrainTypeBadge type={train.trainType} />
            <TrainStatusBadge status={train.trainStatus} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-slate-900">{fmt.fare(train.fare)}</p>
          <p className="text-xs text-slate-500">per traveller</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div>
          <p className="text-xl font-bold text-slate-900">{fmt.time(train.departureTime)}</p>
          <p className="text-sm text-slate-600">{train.source}</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[11px] text-slate-500">{fmt.duration(train.durationInMinutes)}</span>
          <ArrowSeparator />
          <span className="text-[11px] text-slate-500">{fmt.date(train.departureTime)}</span>
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900">{fmt.time(train.arrivalTime)}</p>
          <p className="text-sm text-slate-600">{train.destination}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <span className="flex items-center gap-1.5">
          <Armchair size={15} />
          <span className={cn(seats > 20 && 'text-green-700')}>
            {seats > 0 ? `${seats} seats left` : 'Waitlist / RAC likely'}
          </span>
        </span>
        <span className="text-xs text-slate-400">{train.distanceKm.toFixed(0)} km</span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link
          to={`/train/${train.id}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Book now <ChevronRight size={15} />
        </Link>
        <span className="text-xs text-slate-400">Duration {fmt.duration(train.durationInMinutes)}</span>
      </div>
    </div>
  );
}

function ArrowSeparator() {
  return (
    <span className="relative my-2 h-0.5 w-24 rounded bg-brand-900/30">
      <span className="absolute -right-1 -top-2 text-brand-900 text-sm">›</span>
    </span>
  );
}