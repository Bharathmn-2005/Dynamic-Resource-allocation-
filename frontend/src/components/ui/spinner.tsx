import { cn } from '../../utils/classNames';
import type { HTMLAttributes } from 'react';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const dim = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  return (
    <div className={cn('inline-flex items-center justify-center', className)} role="status" aria-label="loading">
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.173 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}
