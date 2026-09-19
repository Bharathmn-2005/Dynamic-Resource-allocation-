export const env = {
  authUrl: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8080',
  bookingUrl: import.meta.env.VITE_BOOKING_SERVICE_URL || 'http://localhost:8082',
  paymentUrl: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8083',
  mode: import.meta.env.MODE ?? 'development',
  isDev: import.meta.env.DEV ?? import.meta.env.MODE === 'development',
  isProd: import.meta.env.PROD ?? false,
};
