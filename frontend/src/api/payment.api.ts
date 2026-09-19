import { paymentApi } from './client';
import type { PaymentResponse, PaymentInitiateRequest } from '../types/payment';

export const PaymentApi = {
  async initiate(payload: PaymentInitiateRequest): Promise<PaymentResponse> {
    return paymentApi.post('/api/payments/initiate', payload).then((res) => res.data);
  },

  async confirm(paymentId: string): Promise<PaymentResponse> {
    return paymentApi.post(`/api/payments/${paymentId}/confirm`).then((res) => res.data);
  },

  async fail(paymentId: string, reason?: string): Promise<PaymentResponse> {
    return paymentApi
      .post(`/api/payments/${paymentId}/fail`, reason ?? {})
      .then((res) => res.data);
  },

  async cancel(paymentId: string): Promise<PaymentResponse> {
    return paymentApi.post(`/api/payments/${paymentId}/cancel`).then((res) => res.data);
  },

  async getById(paymentId: string): Promise<PaymentResponse> {
    return paymentApi.get(`/api/payments/${paymentId}`).then((res) => res.data);
  },

  async getMyPayments(): Promise<PaymentResponse[]> {
    return paymentApi.get('/api/payments/me').then((res) => res.data);
  },

  async getPaymentForBooking(bookingId: number): Promise<PaymentResponse | null> {
    const payments = await this.getMyPayments().catch(() => []);
    return payments.find((p) => p.bookingId === bookingId) ?? null;
  },
};
