import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from './authContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * When Supabase is configured, redirects to landing (/) if the user is not authenticated.
 * When Supabase is not configured (static data), renders children without requiring auth.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDD0] flex items-center justify-center">
        <div className="text-[#8B4513] font-medium">Loading your stable…</div>
      </div>
    );
  }

  if (isConfigured && !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
