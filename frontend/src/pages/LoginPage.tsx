import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../features/auth/auth.context';
import { AuthShell } from '../components/AuthShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FormField } from '../components/ui/form-field';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const [error, setError] = useState<string | undefined>(undefined);

  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const target = from === '/login' || from === '/register' ? '/' : from;

  const onSubmit = async (values: LoginForm) => {
    setError(undefined);
    try {
      await login(values.email, values.password);
      navigate(target, { replace: true });
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : 'Unable to log you in. Please try again.',
      );
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to book and manage your train journeys."
      error={error}
      loading={isLoading}
      footer={
        <>
          Don’t have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="email" label="Email">
          {(field) => (
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...field}
            />
          )}
        </FormField>

        <FormField control={control} name="password" label="Password">
          {(field) => (
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Your password"
              icon={<Lock size={16} />}
              error={errors.password?.message}
              {...field}
            />
          )}
        </FormField>

        <Button
          type="submit"
          className="mt-2 w-full"
          disabled={isSubmitting}
          leftIcon={<LogIn size={16} />}
        >
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </AuthShell>
  );
}