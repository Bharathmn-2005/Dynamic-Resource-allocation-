import { Train } from 'lucide-react';
import { cn } from '../../utils/classNames';

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-900 text-white shadow',
        className,
      )}
    >
      <Train size={18} strokeWidth={2.2} />
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <Logo />
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold tracking-tight text-slate-900">
          RailVoyage
        </span>
        <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500">
          Book · Travel · Arrive
        </span>
      </span>
    </span>
  );
}
