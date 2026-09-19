import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CreditCard, Ticket, User } from 'lucide-react';
import { BookingApi } from '../api/booking.api';
import { PaymentApi } from '../api/payment.api';
import type { BookingDetails } from '../types/booking';
import type { PaymentResponse } from '../types/payment';
import { BookingStatusBadge, PaymentStatusBadge } from '../components/badges';
import { ErrorState, PageLoader } from '../components/ui/feedback';
import { fmt } from '../utils/formatters';

export function BookingDetailPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const bid = Number(bookingId);

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
      setError(e instanceof Error ? e.message : 'Unable to load this booking.');
    } finally {
      setLoading(false);
    }
  }, [bid]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading || !booking) return <PageLoader label="Loading booking…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ErrorState title="Booking unavailable" message={error} onRetry={load} />
      </div>
    );
  }

  const paid = payment?.status === 'SUCCESS';

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link to="/my-bookings" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft size={16} /> My bookings
      </Link>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{booking.trainName}</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Train #{booking.trainNumber} · {booking.source} → {booking.destination}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <BookingStatusBadge status={booking.bookingStatus} />
            {payment ? <PaymentStatusBadge status={payment.status} /> : null}
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
          <div className="grid gap-1 sm:grid-cols-2">
            <span className="flex items-center gap-2">
              <User size={15} /> {booking.userEmail}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays size={15} /> {fmt.date(booking.journeyDate)}
            </span>
            <span>
              PNR <span className="font-semibold text-slate-900">{booking.pnr}</span>
            </span>
            <span>
              Seat <span className="font-semibold text-slate-900">{booking.seatNumber}</span>
            </span>
          </div>
          {booking.passengers && booking.passengers.length > 0 ? (
            <div className="mt-3 grid gap-2">
              {booking.passengers.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span>
                    {p.name} · {p.age}y · {p.gender}
                  </span>
                  {p.seatNumber ? <span>Seat: {p.seatNumber}</span> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <dl className="mt-4 flex items-center justify-between rounded-lg border border-slate-200 p-3">
          <dt className="text-sm text-slate-500">Total fare</dt>
          <dd className="text-2xl font-bold text-slate-900">{fmt.fare(booking.fare)}</dd>
        </dl>

        {booking.bookingStatus !== 'CANCELLED' && !paid ? (
          <Link
            to={`/payment/${booking.bookingId}`}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <CreditCard size={16} /> {payment ? 'Continue payment' : 'Pay now'}
          </Link>
        ) : paid ? (
          <Link
            to={`/confirmation/${booking.bookingId}`}
            className="mt-5 inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            View confirmation
          </Link>
        ) : null}
      </div>
    </div>
  );
}