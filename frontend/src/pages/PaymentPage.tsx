import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, BadgeCheck, CreditCard, Loader2, ShieldCheck, Ticket } from 'lucide-react';
import { BookingApi } from '../api/booking.api';
import { PaymentApi } from '../api/payment.api';
import type { BookingDetails } from '../types/booking';
import type { PaymentResponse } from '../types/payment';
import { useToast } from '../features/ui/toast.context';
import { Stepper } from '../components/ui/stepper';
import { Button } from '../components/ui/button';
import { PaymentStatusBadge } from '../components/badges';
import { ErrorState, PageLoader } from '../components/ui/feedback';
import { fmt } from '../utils/formatters';

type FlowPhase = 'loading' | 'review' | 'processing' | 'success' | 'failed';

const MAX_POLLS = 8;
const POLL_INTERVAL_MS = 1200;

export function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const bid = Number(bookingId);
  const navigate = useNavigate();
  const toast = useToast();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [phase, setPhase] = useState<FlowPhase>('loading');
  const [actionError, setActionError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const loadBooking = useCallback(async () => {
    if (!Number.isFinite(bid)) {
      setPhase('failed');
      return;
    }
    try {
      const b = await BookingApi.getById(bid);
      setBooking(b);
      setPhase('review');
    } catch (e) {
      setPhase('failed');
      setActionError(e instanceof Error ? e.message : 'Unable to load this booking.');
    }
  }, [bid]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  const pollPayment = useCallback(async (paymentId: string): Promise<PaymentResponse> => {
    let current: PaymentResponse | null = null;
    for (let i = 0; i < MAX_POLLS; i++) {
      current = await PaymentApi.getById(paymentId);
      if (
        current.status === 'SUCCESS' ||
        current.status === 'FAILED' ||
                current.status === 'CANCELLED'
      ) {
              return current;
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }
    return current!;
  }, []);

  const initiatePayment = async () => {
    if (!booking) return;
    setBusy(true);
    setActionError(null);
    try {
      const p = await PaymentApi.initiate({ bookingId: booking.bookingId });
      setPayment(p);
      setPhase('processing');
      toast.info('Payment initiated. Confirm the sandbox payment to continue.');
    } catch (e) {
      setActionError(e instanceof Error ? e.message : 'Unable to start payment.');
      setPhase('review');
    } finally {
      setBusy(false);
    }
  };

  const confirmPayment = async () => {
    if (!payment) return;
    setBusy(true);
    setActionError(null);
    try {
      setPhase('processing');
      await PaymentApi.confirm(payment.paymentId);
      const final = await pollPayment(payment.paymentId);
      setPayment(final);
      if (final.status === 'SUCCESS') {
        setPhase('success');
        toast.success('Payment successful');
        window.setTimeout(
          () => navigate(`/confirmation/${booking?.bookingId}`, { replace: true }),
          1200,
        );
      } else if (final.status === 'FAILED') {
        setPhase('failed');
        setActionError(final.failureReason ?? 'The payment was not successful.');
      } else {
        setPhase('review');
        setActionError('Payment has not completed yet. Please try again.');
      }
    } catch (e) {
      setPhase('review');
      setActionError(e instanceof Error ? e.message : 'Payment confirmation failed.');
    } finally {
      setBusy(false);
    }
  };

  const cancelPayment = async () => {
    if (!payment) return;
    setBusy(true);
    setActionError(null);
    try {
      const p = await PaymentApi.cancel(payment.paymentId);
      setPayment(p);
      setPhase('review');
      setActionError('Payment cancelled. You can start a new payment when ready.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unable to cancel payment.';
      setActionError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  if (phase === 'loading' || !booking) {
    return <PageLoader label="Loading booking…" />;
  }

  if (phase === 'failed' && !booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ErrorState title="Payment unavailable" message={actionError ?? undefined} onRetry={loadBooking} />
      </div>
    );
  }
return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to="/my-bookings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
      >
        <ArrowLeft size={16} /> My bookings
      </Link>
      <div className="mt-4">
        <Stepper
          steps={[
            { label: 'Search', done: true, current: false },
            { label: 'Review', done: true, current: false },
            { label: 'Traveller', done: true, current: false },
            {
              label: 'Payment',
              done: phase === 'success',
              current: phase === 'review' || phase === 'processing',
            },
          ]}
        />
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <h1 className="text-xl font-bold text-slate-900">Secure checkout</h1>
        <p className="mt-1 text-sm text-slate-500">
          Pay once and receive your confirmation instantly.
        </p>

        <div className="mt-5 rounded-lg bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Ticket size={16} className="text-brand-900/60" />
              <span className="text-sm font-medium text-slate-700">Booking {booking.bookingReference}</span>
            </div>
            <span className="text-xs text-slate-400">PNR {booking.pnr}</span>
          </div>
          <div className="mt-2 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
            <span>{booking.trainName} · {booking.source} → {booking.destination}</span>
            <span className="sm:text-right">{fmt.date(booking.journeyDate)} · Seat {booking.seatNumber}</span>
          </div>
          <dl className="mt-3 flex items-end justify-between border-t border-slate-200 pt-3">
            <dt className="text-sm text-slate-500">Total fare</dt>
            <dd className="text-2xl font-bold text-slate-900">{fmt.fare(booking.fare)}</dd>
          </dl>
        </div>

        {actionError ? (
          <p
            className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {actionError}
          </p>
        ) : null}

        {payment ? (
          <div className="mt-6 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm">
              <span className="text-slate-500">Payment ref</span>
              <span className="font-mono text-xs text-slate-700">{payment.paymentId}</span>
              <PaymentStatusBadge status={payment.status} />
            </div>
            {phase === 'processing' ? (
              <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                <Loader2 size={18} className="animate-spin" />
                Processing payment… this may take a few seconds.
              </div>
            ) : null}
          </div>
        ) : null}
<div className="mt-6">
          {phase === 'review' && payment?.status !== 'SUCCESS' ? (
            <Button
              className="w-full"
              disabled={busy}
              leftIcon={<CreditCard size={16} />}
              onClick={initiatePayment}
            >
              {busy ? 'Starting payment…' : `Pay ${fmt.fare(booking.fare)}`}
            </Button>
          ) : null}

          {phase === 'review' && payment?.status === 'SUCCESS' ? (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
              <BadgeCheck size={24} className="mx-auto text-green-600" />
              <p className="mt-2 text-sm font-medium text-green-800">This booking is already paid.</p>
              <Button
                className="mt-3 w-full"
                onClick={() => navigate(`/confirmation/${booking.bookingId}`, { replace: true })}
              >
                View confirmation
              </Button>
            </div>
          ) : null}

          {phase === 'processing' ? (
            <div className="flex flex-col gap-3">
              <Button
                className="w-full"
                disabled={busy}
                leftIcon={<BadgeCheck size={16} />}
                onClick={confirmPayment}
              >
                {busy ? 'Confirming…' : 'Confirm sandbox payment'}
              </Button>
              <Button variant="outline" className="w-full" disabled={busy} onClick={cancelPayment}>
                Cancel payment
              </Button>
            </div>
          ) : null}

          {phase === 'failed' ? (
            <div className="flex flex-col gap-3">
              <Button className="w-full" onClick={initiatePayment}>
                Try again
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate('/my-bookings', { replace: true })}>
                Back to my bookings
              </Button>
            </div>
          ) : null}

          {phase === 'success' ? (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
              <BadgeCheck size={18} /> Payment confirmed! Redirecting to your confirmation…
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-green-600" />
          Sandbox gateway — no real money is charged. Payment status is confirmed by the Payment Service.
        </div>
      </div>
    </div>
  );
}