export interface TrackedBooking {
  bookingId: number;
  journeyDate: string;
  createdAt: string;
}

const KEY = 'rv_tracked_bookings';

function read(): TrackedBooking[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TrackedBooking[]) : [];
  } catch {
    return [];
  }
}

function write(items: TrackedBooking[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export const bookingStore = {
  add(bookingId: number, journeyDate: string): void {
    const items = read().filter((b) => b.bookingId !== bookingId);
    items.unshift({ bookingId, journeyDate, createdAt: new Date().toISOString() });
    write(items);
  },
  list(): TrackedBooking[] {
    return read();
  },
  has(bookingId: number): boolean {
    return read().some((b) => b.bookingId === bookingId);
  },
  remove(bookingId: number): void {
    write(read().filter((b) => b.bookingId !== bookingId));
  },
};