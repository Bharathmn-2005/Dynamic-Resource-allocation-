import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BadgeCheck, CalendarDays, Copy, Ticket, User } from 'lucide-react';
import { BookingApi } from '../api/booking.api';
import { PaymentApi } from '../api/payment.api';
import type { BookingDetails } from '../types/booking';
import type { PaymentResponse } from '../types/payment';
import { useToast } from '../features/ui/toast.context';
import { BookingStatusBadge, PaymentStatusBadge } from '../components/badges';
import { ErrorState, PageLoader } from '../components/ui/feedback';
import { fmt } from '../utils/formatters';

export function ConfirmationPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const bid = Number(bookingId);
  const toast = useToast();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!Number.isFinite(bid)) {
      setError('Invalid booking id.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const b = await BookingApi.getById(bid);
      const p = await PaymentApi.getPaymentForBooking(bid).catch(() => null);
      setBooking(b);
      setPayment(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load your confirmation.');
    } finally {
      setLoading(false);
    }
  }, [bid]);

  useEffect(() => {
    load();
  }, [load]);

  const copy = (value: string, label: string) => {
    navigator.clipboard?.writeText(value).catch(() => undefined);
    toast.success(`${label} copied`);
  };

  if (loading) return <PageLoader label="Loading confirmation…" />;

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ErrorState title="Confirmation unavailable" message={error ?? undefined} onRetry={load} />
      </div>
    );
  }

  const paid = payment?.status === 'SUCCESS';

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-card">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <BadgeCheck size={32} />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          {paid ? 'Booking confirmed and paid' : 'Booking created'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Thank you, {booking.userEmail}. Your journey is locked in.</p>
        <div className="mt-3 flex justify-center">
          {paid ? <PaymentStatusBadge status="SUCCESS" /> : <BookingStatusBadge status={booking.bookingStatus} />}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-slate-900">Ticket</h2>
        <div className="mt-4 rounded-lg bg-brand-900 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm text-slate-200">
              <Ticket size={16} /> {booking.trainNumber} · {booking.trainName}
            </span>
            <span className="text-xs text-slate-300">{fmt.date(booking.journeyDate)}</span>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{booking.source}</p>
              <p className="text-xs text-slate-300">Boarding</p>
            </div>
            <div className="mx-4 h-px flex-1 bg-white/30" />
            <div className="text-right">
              <p className="text-2xl font-bold">{booking.destination}</p>
              <p className="text-xs text-slate-300">Destination</p>
            </div>
          </div>
        </div>
<dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs text-slate-500">PNR</dt>
            <dd className="mt-1 flex items-center gap-2 font-mono font-semibold text-slate-900">
              {booking.pnr}
              <button
                aria-label="Copy PNR"
                onClick={() => copy(booking.pnr, 'PNR')}
                className="text-slate-400 hover:text-slate-700"
              >
                <Copy size={14} />
              </button>
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs text-slate-500">Booking reference</dt>
            <dd className="mt-1 flex items-center gap-2 font-mono font-semibold text-slate-900">
              {booking.bookingReference}
              <button
                aria-label="Copy reference"
                onClick={() => copy(booking.bookingReference, 'Reference')}
                className="text-slate-400 hover:text-slate-700"
              >
                <Copy size={14} />
              </button>
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs text-slate-500">Seat</dt>
            <dd className="mt-1 font-semibold text-slate-900">{booking.seatNumber}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="text-xs text-slate-500">Fare</dt>
            <dd className="mt-1 font-semibold text-slate-900">{fmt.fare(booking.fare)}</dd>
          </div>
        </dl>

        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <User size={15} /> Passenger · {booking.userEmail}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <CalendarDays size={15} /> Journey on {fmt.date(booking.journeyDate)}
          </div>
        </div>

        {payment ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm">
            <span className="text-slate-500">
              {payment.paymentId ? `Payment ${payment.paymentId}` : 'Payment'}
            </span>
            <PaymentStatusBadge status={payment.status} />
            <span className="ml-auto font-semibold text-slate-900">{fmt.fare(Number(payment.amount))}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to="/my-bookings"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Go to my bookings
        </Link>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
        >
          Book another journey
        </Link>
      </div>
    </div>
  );
}