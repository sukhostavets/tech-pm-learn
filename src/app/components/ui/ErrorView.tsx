import { Button } from './Button';

interface ErrorViewProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorView({
  message,
  onRetry,
  retryLabel = 'Try again',
  className = '',
}: ErrorViewProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[40vh] gap-4 ${className}`}
    >
      <p className="text-red-600">{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>{retryLabel}</Button>
      )}
    </div>
  );
}
