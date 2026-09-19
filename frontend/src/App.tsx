import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './features/auth/auth.context';
import { SearchProvider } from './features/trains/search.context';
import { ToastProvider } from './features/ui/toast.context';
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { AccountLayout } from './layouts/AccountLayout';
import { ProtectedRoute } from './features/auth/protected-route';
import { LandingPage } from './pages/LandingPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { TrainDetailPage } from './pages/TrainDetailPage';
import { BookingPage } from './pages/BookingPage';
import { PaymentPage } from './pages/PaymentPage';
import { ConfirmationPage } from './pages/ConfirmationPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { BookingDetailPage } from './pages/BookingDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ProfilePage } from './pages/account/ProfilePage';
import { ChangePasswordPage } from './pages/account/ChangePasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <SearchProvider>
          <BrowserRouter>
            <Routes>
              {/* Authentication pages (no top nav) */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Route>

              {/* Main application shell */}
              <Route element={<AppLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="search" element={<SearchResultsPage />} />
                <Route path="train/:trainId" element={<TrainDetailPage />} />

                <Route
                  path="book/:trainId"
                  element={
                    <ProtectedRoute>
                      <BookingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="payment/:bookingId"
                  element={
                    <ProtectedRoute>
                      <PaymentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="confirmation/:bookingId"
                  element={
                    <ProtectedRoute>
                      <ConfirmationPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
                <Route
                  path="my-bookings/:bookingId"
                  element={
                    <ProtectedRoute>
                      <BookingDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Account area with its own sub-layout */}
                <Route path="account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
                  <Route index element={<ProfilePage />} />
                  <Route path="change-password" element={<ChangePasswordPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </SearchProvider>
      </AuthProvider>
    </ToastProvider>
  );
}