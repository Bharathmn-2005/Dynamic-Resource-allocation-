import { forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import type { HTMLAttributes } from 'react';

const CardBase = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl bg-white shadow-card',
        className,
      )}
      {...rest}
    />
  );
});
CardBase.displayName = 'Card';

export const Card = CardBase;

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { className, ...rest } = props;
  return <div ref={ref} className={cn('flex flex-col gap-2 p-6 pb-4', className)} {...rest} />;
});
CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <h3 ref={ref} className={cn('text-xl font-semibold text-slate-900', className)} {...rest} />
  );
});
CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>((props, ref) => {
  const { className, ...rest } = props;
  return <p ref={ref} className={cn('text-sm text-slate-500', className)} {...rest} />;
});
CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { className, ...rest } = props;
  return <div ref={ref} className={cn('p-6 pt-0', className)} {...rest} />;
});
CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { className, ...rest } = props;
  return <div ref={ref} className={cn('flex items-center p-6 pt-4', className)} {...rest} />;
});
CardFooter.displayName = 'CardFooter';
