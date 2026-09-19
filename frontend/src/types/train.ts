export type TrainType = 'EXPRESS' | 'SUPERFAST' | 'RAJDHANI' | 'SHATABDI' | 'DURONTO' | 'PASSENGER';
export type TrainStatus = 'ACTIVE' | 'CANCELLED' | 'MAINTENANCE';

export interface TrainResponse {
  id: number;
  trainNumber: number;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  durationInMinutes: number;
  distanceKm: number;
  availableSeats: number;
  racCount: number;
  waitlistCount: number;
  fare: number;
  trainType: TrainType;
  trainStatus: TrainStatus;
}

export interface TrainSearchResult {
  recordId: string;
  trainNumber: number;
  source: string;
  destination: string;
  journeyDate: string;
  classOfTravel?: string;
  quota?: string;
  bookingDate?: string;
  currentStatus?: string;
  numberOfPassengers?: number;
  ageOfPassengers?: string;
  bookingChannel?: string;
  travelDistance?: number;
  numberOfStations?: number;
  travelTime?: number;
  trainType?: string;
  seatAvailability?: number;
  specialConsiderations?: string;
  holidayOrPeakSeason?: string;
  waitlistPosition?: string;
  confirmationStatus?: string;
  bookableTrainId: number | null;
  bookable: boolean;
}

export interface SeatAvailabilityResponse {
  trainNumber: number;
  trainName: string;
  totalSeats: number;
  availableSeats: number;
}

export interface Station {
  code: string;
  name: string;
}

export interface SearchCriteria {
  source: string;
  destination: string;
  journeyDate: string;
  passengers: number;
}

export interface TrainFilter {
  trainTypes: TrainType[];
  maxFare: number;
  sortBy: 'departure' | 'duration' | 'fare' | 'arrival';
  sortDir: 'asc' | 'desc';
}
