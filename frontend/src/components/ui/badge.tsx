import { forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import type { HTMLAttributes } from 'react';

export type BadgeVariant = 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-blue-100 text-blue-800',
  secondary: 'bg-slate-100 text-slate-800',
  outline: 'border border-slate-300 text-slate-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  destructive: 'bg-red-100 text-red-800',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs font-medium',
};

export const Badge = forwardRef<HTMLDivElement, BadgeProps>((props, ref) => {
  const { variant = 'default', size = 'md', className, ...rest } = props;
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    />
  );
});
Badge.displayName = 'Badge';
