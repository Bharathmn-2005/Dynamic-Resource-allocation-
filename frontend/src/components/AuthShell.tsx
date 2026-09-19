import type { ReactNode } from 'react';
import { Logo } from './ui/logo';
import { FormSuccessBanner, FormErrorBanner } from './ui/error-message';
import { Spinner } from './ui/spinner';

export interface AuthShellProps {
  title: string;
  subtitle?: string;
  error?: string;
  success?: string;
  loading?: boolean;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthShell({ title, subtitle, error, success, loading, children, footer }: AuthShellProps) {
  return (
    <div className="bg-slate-100 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mx-auto mb-4 flex items-center justify-center gap-2">
          <Logo />
          <span className="font-display text-lg font-bold text-slate-900">RailVoyage</span>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          <div className="mt-5">
            <FormErrorBanner message={error} />
            <FormSuccessBanner message={success} />
            {children}
          </div>
        </div>
        {footer ? <div className="mt-4 text-center text-sm text-slate-600">{footer}</div> : null}
      </div>
      {loading ? (
        <div className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Spinner size="lg" className="text-blue-600" />
        </div>
      ) : null}
    </div>
  );
}