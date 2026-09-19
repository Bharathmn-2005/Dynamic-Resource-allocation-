export type TrainType = 'EXPRESS' | 'SUPERFAST' | 'RAJDHANI' | 'SHATABDI' | 'DURONTO' | 'PASSENGER';
export type TrainStatus = 'ACTIVE' | 'CANCELLED' | 'MAINTENANCE';

export interface TrainResponse {
  id: number;
  trainNumber: number;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string; // ISO datetime
  arrivalTime: string; // ISO datetime
  durationInMinutes: number;
  distanceKm: number;
  availableSeats: number;
  racCount: number;
  waitlistCount: number;
  fare: number;
  trainType: TrainType;
  trainStatus: TrainStatus;
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
  journeyDate: string; // ISO date (yyyy-MM-dd)
  passengers: number;
}

export interface TrainFilter {
  trainTypes: TrainType[];
  maxFare: number;
  sortBy: 'departure' | 'duration' | 'fare' | 'arrival';
  sortDir: 'asc' | 'desc';
}
