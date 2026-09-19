import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Armchair, ArrowLeft, Plus, Trash2, Ticket } from 'lucide-react';
import { TrainApi, BookingApi } from '../api/booking.api';
import type { TrainResponse, SeatAvailabilityResponse } from '../types/train';
import type { BerthPreference, Gender, Passenger } from '../types/booking';
import { useToast } from '../features/ui/toast.context';
import { useSearch } from '../features/trains/search.context';
import { Stepper } from '../components/ui/stepper';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { ErrorState, PageLoader } from '../components/ui/feedback';
import { bookingStore } from '../utils/booking-store';
import { fmt } from '../utils/formatters';

interface PassengerDraft {
  name: string;
  age: string;
  gender: Gender;
}

export function BookingPage() {
  const { trainId } = useParams<{ trainId: string }>();
  const id = Number(trainId);
  const { query } = useSearch();
  const navigate = useNavigate();
  const toast = useToast();

  const [train, setTrain] = useState<TrainResponse | null>(null);
  const [availability, setAvailability] = useState<SeatAvailabilityResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [passengers, setPassengers] = useState<PassengerDraft[]>([
    { name: '', age: '25', gender: 'MALE' },
  ]);
  const [berthPreference, setBerthPreference] = useState<BerthPreference>('LOWER');

  const journeyDate = query?.journeyDate ?? new Date().toISOString().slice(0, 10);
  const passengerCount = passengers.length;

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setLoadError('Invalid train id.');
      setLoading(false);
      return;
    }
    Promise.all([TrainApi.getById(id), TrainApi.getAvailability(id)])
      .then(([t, a]) => {
        setTrain(t);
        setAvailability(a);
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : 'Unable to load train.'))
      .finally(() => setLoading(false));
  }, [id]);

  const updatePassenger = (idx: number, patch: Partial<PassengerDraft>) => {
    setPassengers((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!train) return;

    for (const p of passengers) {
      if (p.name.trim().length < 2) {
        setSubmitError('Each traveller needs a name (at least 2 characters).');
        return;
      }
      const age = Number(p.age);
      if (!Number.isInteger(age) || age < 1 || age > 120) {
        setSubmitError('Each traveller needs a valid age (1-120).');
        return;
      }
    }

    const mapped: Passenger[] = passengers.map((p) => ({
      name: p.name.trim(),
      age: Number(p.age),
      gender: p.gender,
    }));

    setSubmitting(true);
    setSubmitError(null);
    try {
      const booking = await BookingApi.create({
        trainId: train.id,
        travelDate: journeyDate,
        passengers: mapped.map((p) => ({
          name: p.name,
          age: p.age,
          gender: p.gender as 'MALE' | 'FEMALE',
        })),
        berthPreference,
      });
      bookingStore.add(booking.bookingId, journeyDate);
      toast.success(`Booking created — ${booking.bookingReference}`);
      navigate(`/payment/${booking.bookingId}`, { replace: true });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Unable to create your booking. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader label="Loading train…" />;

  if (loadError || !train) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ErrorState title="Train unavailable" message={loadError ?? undefined} />
      </div>
    );
  }

  const totalSeats = availability?.totalSeats ?? train.availableSeats ?? 0;
  const availableSeats = availability?.availableSeats ?? train.availableSeats ?? 0;
  const takenSeats = Math.max(0, totalSeats - availableSeats);
  const totalFare = train.fare * passengerCount;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to={`/train/${train.id}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} /> Back to train
      </Link>
      <div className="mt-4">
        <Stepper
          steps={[
            { label: 'Search', done: true, current: false },
            { label: 'Review', done: true, current: false },
            { label: 'Traveller', done: false, current: true },
            { label: 'Payment', done: false, current: false },
          ]}
        />
      </div>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <h1 className="text-xl font-bold text-slate-900">Traveller details</h1>
        <p className="mt-1 text-sm text-slate-500">
          {train.trainName} · {train.source} → {train.destination} · {fmt.date(journeyDate)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <Ticket size={15} /> #{fmt.trainNumber(train.trainNumber)}
          </span>
          <span className="text-slate-400">·</span>
          <span className="font-semibold text-slate-900">{fmt.fare(train.fare)}</span>
          <span className="ml-auto text-blue-700">
            {takenSeats} seat(s) taken · {availableSeats} available
          </span>
        </div>

        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Passengers</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPassengers((p) => [...p, { name: '', age: '25', gender: 'MALE' }])}
                disabled={passengerCount >= Math.max(availableSeats, 1)}
                className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                <Plus size={14} /> Add passenger
              </button>
              {passengerCount > 1 && (
                <button
                  type="button"
                  onClick={() => setPassengers((p) => p.slice(0, -1))}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Trash2 size={14} /> Remove
                </button>
              )}
            </div>
          </div>

          {passengers.map((p, idx) => (
            <div key={idx} className="rounded-lg border border-slate-200 p-4">
              <p className="mb-2 text-xs font-semibold text-slate-500">Passenger {idx + 1}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                  placeholder="Name as per ID"
                  value={p.name}
                  onChange={(e) => updatePassenger(idx, { name: e.target.value })}
                />
                <Input
                  type="number"
                  min={1}
                  max={120}
                  value={p.age}
                  onChange={(e) => updatePassenger(idx, { age: e.target.value })}
                />
                <Select
                  value={p.gender}
                  onChange={(e) => updatePassenger(idx, { gender: e.target.value as Gender })}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </Select>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Passenger #{idx + 1} will be assigned a berth automatically when the booking is confirmed.
              </p>
            </div>
          ))}

          <div className="pt-2">
            <h2 className="mb-2 text-sm font-semibold text-slate-700">Berth preference</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(['LOWER', 'MIDDLE', 'UPPER', 'SIDE_LOWER', 'SIDE_UPPER'] as BerthPreference[]).map((option) => (
                <button
              key={option}
              type="button"
              onClick={() => setBerthPreference(option)}
              className={[
                'rounded-lg border px-3 py-2 text-left text-sm font-medium transition-colors',
                berthPreference === option
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50',
              ].join(' ')}
                >
              {option.replace('_', ' ')}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              The system will auto-allocate the closest available berth matching your preference. Manual seat selection is disabled for railway-style booking.
            </p>
          </div>

          {submitError ? (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {submitError}
            </p>
          ) : null}

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={submitting}
            leftIcon={<Armchair size={16} />}
          >
            {submitting ? 'Creating booking…' : `Continue to payment · ${fmt.fare(totalFare)}`}
          </Button>
        </form>
      </div>
    </div>
  );
}
