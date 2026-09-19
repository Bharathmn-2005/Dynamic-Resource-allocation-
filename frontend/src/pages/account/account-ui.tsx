import { ErrorState, PageLoader } from '../../components/ui/feedback';

export { ErrorState, PageLoader };

export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
      role="status"
    >
      {message}
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
      role="alert"
    >
      {message}
    </div>
  );
}