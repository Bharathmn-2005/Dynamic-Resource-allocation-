import { forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const inputBase =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 ' +
  'placeholder-slate-400 transition-shadow focus:border-blue-600 focus:ring-2 focus:ring-blue-200';

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, error, icon, className, ...rest } = props;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? (
        <label className="text-sm font-medium text-slate-700">{label}</label>
      ) : null}
      <div className="relative">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {icon}
          </span>
        ) : null}
        <input
          ref={ref}
          className={cn(inputBase, icon && 'pl-10', error && 'border-red-500 focus:ring-red-200')}
          {...rest}
        />
      </div>
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
});
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string }>((props, ref) => {
  const { label, error, className, ...rest } = props;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? <label className="text-sm font-medium text-slate-700">{label}</label> : null}
      <textarea
        ref={ref}
        rows={4}
        className={cn(
          inputBase,
          'min-h-[80px] resize-y',
          error && 'border-red-500 focus:ring-red-200',
        )}
        {...rest}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
});
Textarea.displayName = 'Textarea';

export const DateInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, error, className, ...rest } = props;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label ? <label className="text-sm font-medium text-slate-700">{label}</label> : null}
      <input
        ref={ref}
        type="date"
        className={cn(inputBase, 'py-2.5', error && 'border-red-500 focus:ring-red-200')}
        {...rest}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
});
DateInput.displayName = 'DateInput';
