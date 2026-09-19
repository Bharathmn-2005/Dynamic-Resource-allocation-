import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Ticket } from 'lucide-react';
import { BookingApi } from '../api/booking.api';
import { PaymentApi } from '../api/payment.api';
import type { MyBooking } from '../types/booking';
import type { PaymentResponse } from '../types/payment';
import { BookingStatusBadge, PaymentStatusBadge } from '../components/badges';
import { EmptyState, ErrorState, PageLoader } from '../components/ui/feedback';
import { fmt } from '../utils/formatters';

interface Row {
  booking: MyBooking;
  payment?: PaymentResponse | null;
  failed?: boolean;
}

async function fetchRow(booking: MyBooking): Promise<Row> {
  try {
    const payment = await PaymentApi.getPaymentForBooking(booking.bookingId).catch(() => null);
    return { booking, payment: payment ?? null };
  } catch {
    return { booking, payment: null };
  }
}

export function MyBookingsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const bookings = await BookingApi.getMyBookings();
      const items = await Promise.all(bookings.map((b) => fetchRow(b)));
      // Keep the most recent first.
      items.sort(
        (a, b) =>
          new Date(b.booking.bookingTime ?? b.booking.journeyDate).getTime() -
          new Date(a.booking.bookingTime ?? a.booking.journeyDate).getTime(),
      );
      setRows(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to load your bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  if (loading) return <PageLoader label="Loading your bookings…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <ErrorState title="Could not load bookings" message={error} onRetry={reload} />
      </div>
    );
  }

  const validRows = rows.filter((r) => !r.failed && r.booking);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My bookings</h1>
          <p className="mt-1 text-sm text-slate-500">
            {validRows.length} booking{validRows.length === 1 ? '' : 's'} found for your account.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Ticket size={16} /> Book a new journey
        </Link>
      </div>

      {validRows.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={<Ticket size={22} />}
            title="No bookings yet"
            description="When you book a train, your tickets will appear here so you can track them anytime."
            action={
              <Link
                to="/"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Search trains
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {validRows.map(({ booking, payment }) => (
            <Link
              key={booking.bookingId}
              to={`/my-bookings/${booking.bookingId}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Ticket size={20} />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-slate-900">
                      {booking.trainName}{' '}<span className="text-sm font-normal text-slate-500">· {booking.trainNumber}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {booking.source} → {booking.destination} · {fmt.date(booking.journeyDate)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {payment ? <PaymentStatusBadge status={payment.status} /> : null}
                  <BookingStatusBadge status={booking.bookingStatus} />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
                <span>
                  PNR <span className="font-mono font-semibold text-slate-900">{booking.pnr}</span>
                </span>
                <span>
                  Seat{' '}
                  <span className="font-semibold text-slate-900">
                    {booking.passengers?.map((p) => p.seatNumber).filter(Boolean).join(', ') || 'auto'}
                  </span>
                </span>
                <span className="ml-auto flex items-center gap-1 font-semibold text-slate-900">
                  {fmt.fare(booking.fare)}
                  <ChevronRight size={16} className="text-slate-300 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
