export type Gender = 'MALE' | 'FEMALE';
export type BerthPreference = 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE_LOWER' | 'SIDE_UPPER';
export type BookingStatus = 'CANCELLED' | 'WAITING' | 'CONFIRMED';

export interface Passenger {
  name: string;
  age: number;
  gender: Gender;
  seatNumber?: string;
}

export interface BookingRequest {
  trainId: number;
  travelDate: string; // ISO date (yyyy-MM-dd)
  passengerName: string;
  age: number;
  gender: Gender;
  berthPreference?: BerthPreference;
  /** Optional multi-passenger payload. When provided, passengerName/age/gender
   * are ignored and the `passengers` list is used instead. */
  passengers?: Passenger[];
  /** Legacy manual seat selection is no longer used; the backend auto-allocates */
  seatNumbers?: string[];
  seatNumber?: string;
  trainNumber?: number;
  trainName?: string;
  source?: string;
  destination?: string;
  fare?: number;
  trainClass?: string;
  quota?: string;
}

/** Response returned by POST /booking (now includes the numeric booking id). */
export interface BookingResponse {
  bookingId: number;
  bookingReference: string;
  passengerName: string;
  seatNumber: string;
  bookingStatus: BookingStatus;
  message: string;
}

/** Full booking details returned by GET /booking/{id}. */
export interface BookingDetails {
  bookingId: number;
  pnr: string;
  bookingReference: string;
  userEmail: string;
  userId: number;
  trainId: number;
  trainNumber: number;
  trainName: string;
  source: string;
  destination: string;
  journeyDate: string; // ISO date
  seatNumber: string;
  fare: number;
  bookingStatus: BookingStatus;
  passengers?: Passenger[];
}

/** Booking record returned by GET /booking/my. */
export interface MyBooking {
  bookingId: number;
  pnr: string;
  bookingReference: string;
  trainId: number;
  trainNumber: number;
  trainName: string;
  source: string;
  destination: string;
  journeyDate: string; // ISO date
  fare: number;
  bookingStatus: BookingStatus;
  trainClass?: string;
  quota?: string;
  bookingTime?: string; // ISO datetime
  passengers?: Passenger[];
}

/** A booking record reconstructed for the local "My Bookings" view. */
export interface BookingRecord {
  bookingId: number;
  bookingReference: string;
  pnr: string;
  trainName: string;
  trainNumber: number;
  source: string;
  destination: string;
  journeyDate: string;
  seatNumber: string;
  fare: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  createdAt: string; // ISO datetime
}

import type { PaymentStatus } from './payment';
