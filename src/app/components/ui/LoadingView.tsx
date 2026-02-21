import { theme } from '../../../lib/theme';

interface LoadingViewProps {
  message?: string;
  className?: string;
}

export function LoadingView({ message = 'Loading…', className = '' }: LoadingViewProps) {
  return (
    <div
      className={`flex items-center justify-center min-h-[40vh] ${className}`}
      style={{ color: theme.colors.brown }}
    >
      <p className="font-medium">{message}</p>
    </div>
  );
}
