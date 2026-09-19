import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MapPin, Phone, Save, UserRound } from 'lucide-react';
import { AuthApi } from '../../api/auth.api';
import type { ProfileResponse } from '../../types/auth';
import { useAuth } from '../../features/auth/auth.context';
import { useToast } from '../../features/ui/toast.context';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { FormField } from '../../components/ui/form-field';
import { ErrorState, PageLoader, FormSuccess } from './account-ui';

const schema = z.object({
  username: z.string().trim().min(2, 'Name is required').max(50),
  city: z.string().trim().optional().or(z.literal('')),
  state: z.string().trim().optional().or(z.literal('')),
  country: z.string().trim().optional().or(z.literal('')),
  address: z.string().trim().optional().or(z.literal('')),
  phoneNumber: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((v) => !v || /^[0-9]{10}$/.test(v), { message: 'Enter a valid 10-digit mobile number' }),
});

type ProfileForm = z.infer<typeof schema>;

export function ProfilePage() {
  const { refreshProfile } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', city: '', state: '', country: '', address: '', phoneNumber: '' },
  });

  useEffect(() => {
    AuthApi.getProfile()
      .then((p) => {
        setProfile(p);
        reset({
          username: p.username,
          city: '',
          state: '',
          country: '',
          address: '',
          phoneNumber: '',
        });
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : 'Unable to load your profile.'))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values: ProfileForm) => {
    setSaving(true);
    setSaved(false);
    try {
      await AuthApi.updateProfile({
        username: values.username,
        city: values.city ?? '',
        state: values.state ?? '',
        country: values.country ?? '',
        address: values.address ?? '',
        phoneNumber: values.phoneNumber ?? '',
      });
      setProfile((p) => (p ? { ...p, username: values.username } : p));
      await refreshProfile();
      setSaved(true);
      toast.success('Profile updated');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader label="Loading profile…" />;

  if (loadError || !profile) {
    return <ErrorState title="Profile unavailable" message={loadError ?? undefined} />;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
      <h2 className="text-lg font-semibold text-slate-900">Profile details</h2>
      <p className="mt-1 text-sm text-slate-500">
        Your email and role are managed by the Auth Service and cannot be edited here.
      </p>
      <div className="mt-4 flex flex-wrap gap-4 rounded-lg bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <UserRound size={16} /> <span className="font-medium text-slate-800">{profile.username}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Mail size={16} /> {profile.email}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Phone size={16} /> {profile.phoneNumber || '—'}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <BadgeRole role={profile.role} />
        </div>
      </div>

      {saved ? <FormSuccess message="Your profile has been updated." /> : null}

      <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField control={control} name="username" label="Display name">
          {(f) => <Input error={errors.username?.message} {...f} />}
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={control} name="country" label="Country">
            {(f) => <Input error={errors.country?.message} icon={<MapPin size={15} />} {...f} />}
          </FormField>
          <FormField control={control} name="city" label="City">
            {(f) => <Input error={errors.city?.message} {...f} />}
          </FormField>
        </div>

        <FormField control={control} name="state" label="State">
          {(f) => <Input error={errors.state?.message} {...f} />}
        </FormField>

        <FormField control={control} name="address" label="Address">
          {(f) => <Input error={errors.address?.message} {...f} />}
        </FormField>

        <FormField control={control} name="phoneNumber" label="Mobile number" hint="Leave blank to keep your registered number unchanged within this session.">
          {(f) => <Input type="tel" maxLength={10} error={errors.phoneNumber?.message} icon={<Phone size={15} />} {...f} />}
        </FormField>

        <Button type="submit" className="mt-2 w-full" disabled={saving} leftIcon={<Save size={16} />}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </form>
    </div>
  );
}

function BadgeRole({ role }: { role: string }) {
  return (
    <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
      {role}
    </span>
  );
}