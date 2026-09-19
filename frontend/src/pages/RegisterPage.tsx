import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../features/auth/auth.context';
import { AuthShell } from '../components/AuthShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FormField } from '../components/ui/form-field';
import type { RegisterRequest } from '../types/auth';

const registerSchema = z
  .object({
    userName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be at most 50 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    address: z.string().min(1, 'Address is required').max(255),
    phoneNumber: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/,
        'Use 8–20 characters with upper, lower, number & symbol',
      ),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
    const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [registered, setRegistered] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: '',
      email: '',
      country: 'India',
      city: '',
      state: '',
      address: '',
      phoneNumber: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: RegisterForm) => {
    setError(undefined);
    setSuccess(undefined);
    const payload: RegisterRequest = {
      userName: values.userName,
      email: values.email,
      country: values.country,
      city: values.city,
      state: values.state,
      address: values.address,
      phoneNumber: values.phoneNumber,
      dateOfBirth: values.dateOfBirth,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };
    try {
            await register(payload);
      setSuccess(
        'We sent a verification link to your email. Please verify your email before logging in.',
      );
      setRegistered(true);
    } catch (e) {
      setError(
        e instanceof Error && e.message
          ? e.message
          : 'Unable to create your account. Please try again.',
      );
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
        <AuthShell
      title={registered ? 'Registration successful!' : 'Create your account'}
      subtitle={registered ? undefined : 'Join RailVoyage to book train tickets in minutes.'}
      error={error}
      success={success}
      loading={isLoading}
      footer={
        registered
          ? undefined
          : (
            <>
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:underline">
                Log in
              </Link>
            </>
          )
      }
    >
      {registered ? (
        <Button
          className="mt-2 w-full"
          leftIcon={<LogIn size={16} />}
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      ) : (
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="userName" label="Full name">
          {(f) => (
            <Input
              autoComplete="name"
              placeholder="e.g. Ananya Sharma"
              error={errors.userName?.message}
              {...f}
            />
          )}
        </FormField>

        <FormField control={control} name="email" label="Email">
          {(f) => (
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...f}
            />
          )}
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          <FormField control={control} name="country" label="Country">
            {(f) => <Input autoComplete="country" error={errors.country?.message} {...f} />}
          </FormField>
          <FormField control={control} name="city" label="City">
            {(f) => <Input autoComplete="address-level2" error={errors.city?.message} {...f} />}
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FormField control={control} name="state" label="State">
            {(f) => <Input autoComplete="address-level1" error={errors.state?.message} {...f} />}
          </FormField>
          <FormField control={control} name="phoneNumber" label="Mobile number">
            {(f) => (
              <Input
                type="tel"
                autoComplete="tel"
                maxLength={10}
                placeholder="10-digit number"
                error={errors.phoneNumber?.message}
                {...f}
              />
            )}
          </FormField>
        </div>

        <FormField control={control} name="address" label="Address">
          {(f) => <Input autoComplete="street-address" error={errors.address?.message} {...f} />}
        </FormField>

        <FormField control={control} name="dateOfBirth" label="Date of birth" hint="Must be in the past">
          {(f) => (
            <Input type="date" max={today} error={errors.dateOfBirth?.message} {...f} />
          )}
        </FormField>

        <FormField control={control} name="password" label="Password">
          {(f) => (
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="8–20 chars with upper, lower, number & symbol"
              error={errors.password?.message}
              {...f}
            />
          )}
        </FormField>

        <FormField control={control} name="confirmPassword" label="Confirm password">
          {(f) => (
            <Input
              type="password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...f}
            />
          )}
        </FormField>

        <Button
          type="submit"
          className="mt-2 w-full"
                    disabled={isSubmitting || registered}
          leftIcon={<UserPlus size={16} />}
        >
                    {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      )}
    </AuthShell>
  );
}
