import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn, RefreshCw } from 'lucide-react';
import type { ReactNode } from 'react';
import { AuthApi } from '../api/auth.api';
import { isApiError } from '../api/errors';
import { AuthShell } from '../components/AuthShell';
import { Button } from '../components/ui/button';

type Status = 'loading' | 'success' | 'invalid' | 'expired' | 'unavailable';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<Status>('loading');

  const verify = useCallback(async () => {
    if (!token) {
      setStatus('invalid');
      return;
    }
    setStatus('loading');
    try {
      await AuthApi.verifyEmail(token);
      setStatus('success');
    } catch (e) {
      if (isApiError(e) && (e.code === 'NETWORK_ERROR' || e.status === undefined)) {
        setStatus('unavailable');
        return;
      }
      const msg = (e instanceof Error ? e.message : '').toLowerCase();
      if (msg.includes('expired')) {
        setStatus('expired');
      } else if (msg.includes('already been used')) {
        // Token already consumed -> account is already verified.
        setStatus('success');
      } else if (msg.includes('invalid')) {
        setStatus('invalid');
      } else {
        setStatus('unavailable');
      }
    }
  }, [token]);

  useEffect(() => {
    void verify();
  }, [verify]);

    let title = 'Verifying your email...';
  let subtitle: string | undefined =
    'Please wait while we confirm your email address.';
  let error: string | undefined = undefined;
  let successMsg: string | undefined = undefined;
  let loading = true;
  let children: ReactNode = null;
  let footer: ReactNode | undefined = undefined;

  if (status === 'success') {
    title = 'Email verified successfully!';
    successMsg = 'Your account is now active.';
    loading = false;
    children = (
      <Button
        className="mt-2 w-full"
        leftIcon={<LogIn size={16} />}
        onClick={() => navigate('/login')}
      >
        Login
      </Button>
    );
  } else if (status === 'invalid') {
    title = 'Invalid verification link.';
    error = 'The link you followed is invalid, missing, or has already been used.';
    loading = false;
    children = (
      <Button className="mt-2 w-full" onClick={() => navigate('/login')}>
        Go to Login
      </Button>
    );
    footer = (
      <Link
        to="/register"
        className="font-medium text-blue-600 hover:underline"
      >
        Register a new account
      </Link>
    );
  } else if (status === 'expired') {
    title = 'Verification link has expired.';
    error = 'This link has expired. Please register again to receive a new link.';
    loading = false;
    children = (
      <Button className="mt-2 w-full" onClick={() => navigate('/register')}>
        Register again
      </Button>
    );
    footer = (
      <Link
        to="/login"
        className="font-medium text-blue-600 hover:underline"
      >
        Back to login
      </Link>
    );
  } else if (status === 'unavailable') {
    title = 'Unable to verify email. Please try again.';
    error = 'We could not reach the verification service. Please try again.';
    loading = false;
    children = (
      <Button
        className="mt-2 w-full"
        leftIcon={<RefreshCw size={16} />}
        onClick={() => void verify()}
      >
        Retry
      </Button>
    );
    footer = (
      <Link
        to="/login"
        className="font-medium text-blue-600 hover:underline"
      >
        Go to Login
      </Link>
    );
  } else {
    // status === 'loading'
    title = 'Verifying your email...';
    subtitle = 'Please wait while we confirm your email address.';
    loading = true;
    children = null;
  }

  return (
    <AuthShell
      title={title}
      subtitle={subtitle}
      error={error}
      success={successMsg}
      loading={loading}
      footer={footer}
    >
      {children}
    </AuthShell>
  );
}
