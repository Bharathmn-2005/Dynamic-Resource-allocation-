import { cn } from '../../utils/classNames';

export interface Step {
  label: string;
  done: boolean;
  current: boolean;
}

export function Stepper({ steps }: { steps: Step[] }) {
  return (
    <div className="flex items-center" aria-label="Progress">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          {i > 0 ? (
            <div
              className={cn(
                'mx-1 h-0.5 flex-1 rounded sm:mx-2',
                step.done || step.current ? 'bg-blue-600' : 'bg-slate-200',
              )}
            />
          ) : null}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                step.done && 'bg-green-600 text-white',
                step.current && 'bg-blue-600 text-white',
                !step.done && !step.current && 'bg-slate-200 text-slate-500',
              )}
            >
              {step.done ? '✓' : i + 1}
            </div>
            <span
              className={cn(
                'mt-1 text-[11px] font-medium sm:text-xs',
                step.current ? 'text-blue-700' : 'text-slate-500',
              )}
            >
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}