import { Controller, useFormContext } from 'react-hook-form';
import type {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Label } from './label';
import { ErrorMessage } from './error-message';
import { cn } from '../../utils/classNames';
import type { ReactNode } from 'react';

export interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  hint?: string;
  control?: Control<T>;
  className?: string;
  children: (
    field: ControllerRenderProps<T, Path<T>>,
    fieldState: ControllerFieldState,
  ) => ReactNode;
}

export function FormField<T extends FieldValues>({
  name,
  label,
  hint,
  control,
  className,
  children,
}: FormFieldProps<T>) {
  const methods = useFormContext<T>();
  const ctl = control ?? methods.control;

  return (
    <Controller
      name={name}
      control={ctl}
      render={({ field, fieldState }) => (
        <div className={cn('flex flex-col gap-1.5', className)}>
          {label ? <Label htmlFor={name as string}>{label}</Label> : null}
          {children(field, fieldState)}
          {fieldState.error ? (
            <ErrorMessage>{fieldState.error.message}</ErrorMessage>
          ) : hint ? (
            <p className="text-xs text-slate-400">{hint}</p>
          ) : null}
        </div>
      )}
    />
  );
}
