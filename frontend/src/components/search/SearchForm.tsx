import { useForm, type Resolver } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRightLeft, CalendarDays, Search, Users, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FormField } from '../ui/form-field';
import { useSearch } from '../../features/trains/search.context';

const searchSchema = z.object({
  source: z.string().trim().min(2, 'Enter a station or city'),
  destination: z.string().trim().min(2, 'Enter a station or city'),
  journeyDate: z.string().min(1, 'Choose a travel date'),
  passengers: z.coerce.number().int().min(1).max(6),
}).refine((d) => d.source.toLowerCase() !== d.destination.toLowerCase(), {
  path: ['destination'],
  message: 'Source and destination must be different',
});

type SearchFormData = z.infer<typeof searchSchema>;

export function SearchForm({ compact, onSubmitting }: { compact?: boolean; onSubmitting?: () => void }) {
  const { search } = useSearch();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema) as Resolver<SearchFormData>,
  defaultValues: {
      source: '',
      destination: '',
      journeyDate: '',
      passengers: 1,
    },
  });

  const minDate = new Date().toISOString().split('T')[0];

  const onSubmit = (values: SearchFormData) => {
    onSubmitting?.();
    search({
      source: values.source,
      destination: values.destination,
      journeyDate: values.journeyDate,
    });
    navigate('/search');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={compact ? 'rounded-xl border border-slate-200 bg-white p-4 shadow-sm' : ''}
    >
      <div className={compact ? 'grid gap-3 md:grid-cols-5' : 'grid gap-4 md:grid-cols-2 lg:grid-cols-4'}>
        <FormField control={control} name="source" label="From">
          {(f) => (
            <Input
              placeholder="Departure city or station"
              autoComplete="off"
              icon={<ArrowRightLeft size={15} className="rotate-180" />}
              error={errors.source?.message}
              {...f}
            />
          )}
        </FormField>

        <FormField control={control} name="destination" label="To">
          {(f) => (
            <Input
              placeholder="Arrival city or station"
              autoComplete="off"
              icon={<ArrowRightLeft size={15} />}
              error={errors.destination?.message}
              {...f}
            />
          )}
        </FormField>

        <FormField control={control} name="journeyDate" label="Journey date">
          {(f) => (
            <Input
              type="date"
              min={minDate}
              icon={<CalendarDays size={15} />}
              error={errors.journeyDate?.message}
              {...f}
            />
          )}
        </FormField>

        <FormField control={control} name="passengers" label="Passengers">
          {(f) => (
            <Input
              type="number"
              min={1}
              max={12}
              icon={<Users size={15} />}
              error={errors.passengers?.message}
              {...f}
            />
          )}
        </FormField>
      </div>

      <Button
        type="submit"
        size={compact ? 'md' : 'lg'}
        className={compact ? 'mt-3 w-full' : 'mt-5 w-full'}
        disabled={isSubmitting}
        leftIcon={<Search size={18} />}
        rightIcon={<ArrowRight size={16} />}
      >
        Search trains
      </Button>
    </form>
  );
}