import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Skeleton } from '@/components/ui/Skeleton';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isRestoringSession } = useAuthStore();
  const location = useLocation();

  if (isRestoringSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-950 p-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 mb-2 animate-bounce">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Restoring Session...</h2>
          <Skeleton variant="text" count={2} className="mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
