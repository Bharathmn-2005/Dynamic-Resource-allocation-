import { Badge } from './ui/badge';
import type { TrainStatus, TrainType } from '../types/train';
import type { BookingStatus } from '../types/booking';
import type { PaymentStatus } from '../types/payment';

export function TrainTypeBadge({ type }: { type: TrainType }) {
  const label = type.replace('_', ' ');
  return <Badge variant="default">{label}</Badge>;
}

export function TrainStatusBadge({ status }: { status: TrainStatus }) {
  const map: Record<TrainStatus, { label: string; variant: 'success' | 'destructive' | 'warning' | 'secondary' }> = {
    ACTIVE: { label: 'Running', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'destructive' },
    MAINTENANCE: { label: 'Under maintenance', variant: 'warning' },
  };
  const s = map[status] ?? { label: status, variant: 'secondary' as const };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, { label: string; variant: 'success' | 'destructive' | 'warning' }> = {
    CONFIRMED: { label: 'Confirmed', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'destructive' },
    WAITING: { label: 'Waiting list', variant: 'warning' },
  };
  const s = map[status] ?? { label: status, variant: 'warning' as const };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { label: string; variant: 'success' | 'destructive' | 'warning' | 'secondary' | 'outline' }> = {
    SUCCESS: { label: 'Paid', variant: 'success' },
    FAILED: { label: 'Failed', variant: 'destructive' },
    PROCESSING: { label: 'Processing', variant: 'warning' },
    CREATED: { label: 'Pending', variant: 'warning' },
    CANCELLED: { label: 'Cancelled', variant: 'secondary' },
    REFUNDED: { label: 'Refunded', variant: 'outline' },
  };
  const s = map[status] ?? { label: status, variant: 'outline' as const };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}