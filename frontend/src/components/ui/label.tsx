import { forwardRef } from 'react';
import { cn } from '../../utils/classNames';
import type { LabelHTMLAttributes } from 'react';

export const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  (props, ref) => {
    const { className, ...rest } = props;
    return (
      <label ref={ref} className={cn('text-sm font-medium text-slate-700', className)} {...rest} />
    );
  },
);
Label.displayName = 'Label';
