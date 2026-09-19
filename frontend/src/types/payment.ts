export type PaymentStatus = 'CREATED' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
export type PaymentProvider = 'SANDBOX' | 'RAZORPAY';

export interface PaymentResponse {
  paymentId: string;
  orderId: string;
  bookingId: number;
  userId: number;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  providerReferenceId: string | null;
  status: PaymentStatus;
  failureReason: string | null;
  createdAt: string; // ISO datetime
  paidAt: string | null;
}

export interface PaymentInitiateRequest {
  bookingId: number;
}

export interface PaymentSummary {
  bookingId: number;
  bookingReference: string;
  pnr: string;
  trainName: string;
  source: string;
  destination: string;
  journeyDate: string;
  fare: number;
  payment: PaymentResponse | null;
}
