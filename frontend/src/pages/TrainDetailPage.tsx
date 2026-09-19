import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Armchair, BatteryCharging, CalendarDays, ChevronLeft, Ticket } from 'lucide-react';
import { TrainApi } from '../api/booking.api';
import type { TrainResponse, SeatAvailabilityResponse } from '../types/train';
import { TrainTypeBadge, TrainStatusBadge } from '../components/badges';
import { ErrorState, Skeleton } from '../components/ui/feedback';
import { fmt, toISODate } from '../utils/formatters';
import { useSearch } from '../features/trains/search.context';

export function TrainDetailPage() {
  const { trainId } = useParams<{ trainId: string }>();
  const id = Number(trainId);
  const { query } = useSearch();

  const [train, setTrain] = useState<TrainResponse | null>(null);
  const [availability, setAvailability] = useState<SeatAvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!Number.isFinite(id)) {
      setError('Invalid train id.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [t, a] = await Promise.all([
        TrainApi.getById(id),
        TrainApi.getAvailability(id).catch(() => null),
      ]);
      setTrain(t);
      setAvailability(a);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load train details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const journeyDate = query?.journeyDate ?? toISODate(new Date());

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Skeleton className="h-5 w-32" />
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-4 h-4 w-40" />
          <Skeleton className="mt-10 h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error || !train) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ErrorState
          title="Train details unavailable"
          message={error ?? 'This train could not be found.'}
          onRetry={load}
        />
      </div>
    );
  }

  const seats = availability?.availableSeats ?? train.availableSeats ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Link
        to={query ? '/search' : '/'}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ChevronLeft size={16} /> Back to {query ? 'results' : 'home'}
      </Link>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Ticket size={16} />
              <span className="font-semibold text-brand-900">#{fmt.trainNumber(train.trainNumber)}</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{train.trainName}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <TrainTypeBadge type={train.trainType} />
              <TrainStatusBadge status={train.trainStatus} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">{fmt.fare(train.fare)}</p>
            <p className="text-xs text-slate-500">per traveller</p>
          </div>
        </div>
<div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="border-r border-slate-200 pr-4">
            <p className="text-2xl font-bold text-slate-900">{fmt.time(train.departureTime)}</p>
            <p className="mt-0.5 text-sm text-slate-600">{train.source}</p>
            <p className="text-xs text-slate-400">{fmt.date(train.departureTime)}</p>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500">{fmt.duration(train.durationInMinutes)}</span>
            <div className="relative my-2 h-0.5 w-32 rounded bg-brand-900/30 sm:w-40">
              <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-brand-900 bg-white" />
            </div>
            <span className="text-xs text-slate-400">{train.distanceKm.toFixed(0)} km</span>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <p className="text-2xl font-bold text-slate-900">{fmt.time(train.arrivalTime)}</p>
            <p className="mt-0.5 text-sm text-slate-600">{train.destination}</p>
            <p className="text-xs text-slate-400">{fmt.date(train.arrivalTime)}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <BatteryCharging size={16} className="text-brand-900/60" />
            Distance {train.distanceKm.toFixed(0)} km
          </div>
          <div className="flex items-center gap-2">
            <Armchair size={16} className="text-brand-900/60" />
            {seats > 0 ? `${seats} seats available` : 'Waitlist / RAC likely'}
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-brand-900/60" />
            Journey {fmt.date(journeyDate)}
          </div>
        </div>

        <Link
          to={`/book/${train.id}`}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Continue to book <ArrowRight size={16} />
        </Link>
        <p className="mt-3 text-center text-xs text-slate-400">
          You will be asked to log in before completing the booking.
        </p>
      </div>
    </div>
  );
}