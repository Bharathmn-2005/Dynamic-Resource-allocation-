import { forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import type { ButtonHTMLAttributes, ComponentPropsWithoutRef, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const base =
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow hover:shadow-md',
  secondary:
    'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 shadow-sm hover:shadow',
  outline:
    'border border-slate-300 text-slate-700 hover:bg-slate-100 active:bg-slate-200',
  ghost: 'text-slate-600 hover:bg-slate-100 active:bg-slate-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow hover:shadow-md',
  accent:
    'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 shadow hover:shadow-md',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
  icon: 'h-10 w-10 px-0',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { variant = 'primary', size = 'md', leftIcon, rightIcon, className, children, ...rest } =
    props;
  return (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {leftIcon ? <span className="mr-2 flex items-center">{leftIcon}</span> : null}
      {children}
      {rightIcon ? <span className="ml-2 flex items-center">{rightIcon}</span> : null}
    </button>
  );
});
Button.displayName = 'Button';

export const buttonLinkClasses =
  'inline-flex items-center justify-center rounded-lg font-medium text-blue-600 ' +
  'hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

