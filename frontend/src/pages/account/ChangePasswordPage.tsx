import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound, Lock, Save, ShieldAlert } from 'lucide-react';
import { AuthApi } from '../../api/auth.api';
import { useToast } from '../../features/ui/toast.context';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { FormField } from '../../components/ui/form-field';
import { FormError, FormSuccess } from './account-ui';

const schema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password'),
    newPassword: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/,
        'Use 8–20 characters with upper, lower, number & symbol',
      ),
    confirmNewPassword: z.string().min(1, 'Re-enter your new password'),
  })
  .refine((d) => d.newPassword === d.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: 'Passwords do not match',
  });

type FormData = z.infer<typeof schema>;

export function ChangePasswordPage() {
  const toast = useToast();
  const [success, setSuccess] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [busy, setBusy] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  const onSubmit = async (values: FormData) => {
    setError(undefined);
    setSuccess(undefined);
    setBusy(true);
    try {
      await AuthApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmNewPassword,
      });
      setSuccess('Your password has been changed.');
      reset({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      toast.success('Password changed');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unable to change your password.';
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
      <h2 className="text-lg font-semibold text-slate-900">Change password</h2>
      <p className="mt-1 text-sm text-slate-500">Choose a strong password you have not used before.</p>

      <FormError message={error} />
      <FormSuccess message={success} />

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="currentPassword" label="Current password">
          {(f) => (
            <Input
              type="password"
              autoComplete="current-password"
              icon={<KeyRound size={16} />}
              error={errors.currentPassword?.message}
              {...f}
            />
          )}
        </FormField>

        <FormField control={control} name="newPassword" label="New password">
          {(f) => (
            <Input
              type="password"
              autoComplete="new-password"
              icon={<Lock size={16} />}
              error={errors.newPassword?.message}
              {...f}
            />
          )}
        </FormField>

        <FormField control={control} name="confirmNewPassword" label="Confirm new password">
          {(f) => (
            <Input
              type="password"
              autoComplete="new-password"
              error={errors.confirmNewPassword?.message}
              {...f}
            />
          )}
        </FormField>

        <Button type="submit" className="mt-2 w-full" disabled={busy} leftIcon={<Save size={16} />}>
          {busy ? 'Updating…' : 'Update password'}
        </Button>
      </form>

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <ShieldAlert size={14} /> Never share your password with anyone.
      </div>
    </div>
  );
}
