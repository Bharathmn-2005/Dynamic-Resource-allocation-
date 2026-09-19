import { cn } from '../../utils/classNames';
import type { ReactNode } from 'react';

export function ErrorMessage({ children, className }: { children?: ReactNode; className?: string }) {
  if (!children) return null;
  return (
    <p className={cn('text-xs text-red-600', className)} role="alert">
      {children}
    </p>
  );
}

export function FormErrorBanner({ message, className }: { message?: string; className?: string }) {
  if (!message) return null;
  return (
    <div
      className={cn(
        'rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700',
        className,
      )}
      role="alert"
    >
      {message}
    </div>
  );
}

export function FormSuccessBanner({ message, className }: { message?: string; className?: string }) {
  if (!message) return null;
  return (
    <div
      className={cn(
        'rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700',
        className,
      )}
      role="status"
    >
      {message}
    </div>
  );
}
