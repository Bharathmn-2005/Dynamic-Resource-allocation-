import { bookingApi } from './client';
import type { TrainResponse, TrainSearchResult, SeatAvailabilityResponse } from '../types/train';
import type { BookingDetails, BookingResponse, MyBooking } from '../types/booking';

export interface TrainSearchParams {
  source?: string;
  destination?: string;
  journeyDate?: string;
  trainNumber?: number;
}

export const TrainApi = {
  async search(params: TrainSearchParams): Promise<TrainSearchResult[]> {
    const { source, destination, journeyDate, trainNumber } = params;
    return bookingApi
      .get('/api/trains/search', { params: { source, destination, journeyDate, trainNumber } })
      .then((res) => res.data);
  },

  async getById(trainId: number): Promise<TrainResponse> {
    return bookingApi.get(`/api/trains/${trainId}`).then((res) => res.data);
  },

  async getAvailability(trainId: number): Promise<SeatAvailabilityResponse> {
    return bookingApi.get(`/api/trains/${trainId}/availability`).then((res) => res.data);
  },
};

export interface CreateBookingPayload {
  trainId: number;
  travelDate: string;
  passengerName?: string;
  age?: number;
  gender?: 'MALE' | 'FEMALE';
  berthPreference?: 'LOWER' | 'MIDDLE' | 'UPPER' | 'SIDE_LOWER' | 'SIDE_UPPER';
  passengers?: {
    name: string;
    age: number;
    gender: 'MALE' | 'FEMALE';
    seatNumber?: string;
  }[];
  seatNumbers?: string[];
}

export const BookingApi = {
  create(payload: CreateBookingPayload): Promise<BookingResponse> {
    return bookingApi.post('/booking', payload).then((res) => res.data);
  },

  getById(bookingId: number): Promise<BookingDetails> {
    return bookingApi.get(`/booking/${bookingId}`).then((res) => res.data);
  },

  getMyBookings(): Promise<MyBooking[]> {
    return bookingApi.get('/booking/my').then((res) => res.data);
  },
};
