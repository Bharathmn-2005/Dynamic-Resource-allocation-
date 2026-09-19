import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';
import { AuthApi } from '../api/auth.api';
import { AuthShell } from '../components/AuthShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { FormField } from '../components/ui/form-field';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordPage() {
  const [error, setError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: FormData) => {
    setError(undefined);
    setSuccess(undefined);
    setBusy(true);
    try {
      await AuthApi.forgotPassword({ email: values.email });
      setSuccess(
        'If an account exists for that email, we have sent a password reset link. Please check your inbox.',
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to send a reset link. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter your registered email and we will send you a reset link."
      error={error}
      success={success}
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Back to login
          </Link>
        </>
      }
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="email" label="Email">
          {(f) => (
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              icon={<Mail size={16} />}
              error={errors.email?.message}
              {...f}
            />
          )}
        </FormField>

        <Button type="submit" className="mt-2 w-full" disabled={busy} leftIcon={<Send size={16} />}>
          {isSubmitting || busy ? 'Sending…' : 'Send reset link'}
        </Button>
      </form>
    </AuthShell>
  );
}