import { forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import { Label } from './label';
import { ErrorMessage } from './error-message';
import type { SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const { label, error, className, children, ...rest } = props;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? <Label>{label}</Label> : null}
      <select
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ' +
            'transition-shadow focus:border-blue-600 focus:ring-2 focus:ring-blue-200',
          error && 'border-red-500 focus:ring-red-200',
        )}
        {...rest}
      >
        {children}
      </select>
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
    </div>
  );
});
Select.displayName = 'Select';
