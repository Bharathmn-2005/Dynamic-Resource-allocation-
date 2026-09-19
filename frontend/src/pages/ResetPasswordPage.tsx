import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { KeyRound, Lock } from 'lucide-react';
import { AuthApi } from '../api/auth.api';
import { AuthShell } from '../components/AuthShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FormField } from '../components/ui/form-field';

const schema = z
  .object({
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/,
        'Use 8–20 characters with upper, lower, number & symbol',
      ),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormData = z.infer<typeof schema>;

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (values: FormData) => {
    setError(undefined);
    setSuccess(undefined);
    if (!token) {
      setError('The reset link is missing a token. Please use the link from your email.');
      return;
    }
    setBusy(true);
    try {
      await AuthApi.resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      setSuccess('Your password has been updated. You can now log in with your new password.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to reset your password. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong, memorable password for your account."
      error={error}
      success={success}
      footer={
        <>
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Back to login
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="newPassword" label="New password">
          {(f) => (
            <Input
              type="password"
              autoComplete="new-password"
              icon={<KeyRound size={16} />}
              placeholder="8–20 chars with upper, lower, number & symbol"
              error={errors.newPassword?.message}
              {...f}
            />
          )}
        </FormField>

        <FormField control={control} name="confirmPassword" label="Confirm new password">
          {(f) => (
            <Input
              type="password"
              autoComplete="new-password"
              icon={<Lock size={16} />}
              error={errors.confirmPassword?.message}
              {...f}
            />
          )}
        </FormField>

        <Button type="submit" className="mt-2 w-full" disabled={busy}>
          {isSubmitting || busy ? 'Resetting…' : 'Reset password'}
        </Button>
      </form>
    </AuthShell>
  );
}