import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const authTarget = env.VITE_AUTH_SERVICE_URL || 'http://localhost:8080';
  const bookingTarget = env.VITE_BOOKING_SERVICE_URL || 'http://localhost:8082';
  const paymentTarget = env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8083';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      open: true,
      proxy: {
        // Auth service
        '/auth': { target: authTarget, changeOrigin: true, secure: false },
        // Payment service (must come before generic /api rules)
        '/api/payments': { target: paymentTarget, changeOrigin: true, secure: false },
        // Booking service: trains + booking
        '/api/trains': { target: bookingTarget, changeOrigin: true, secure: false },
        '/booking': { target: bookingTarget, changeOrigin: true, secure: false },
        // Auth profile endpoints
        '/profile': { target: authTarget, changeOrigin: true, secure: false },
      },
    },
  };
});
