import React, { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuthStore } from '@/features/auth/store/authStore';
import { refreshAuthToken } from '@/services/authInterceptor';

interface ProvidersProps {
  children: React.ReactNode;
}

const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { refreshToken, isRestoringSession, setRestoringSession, logout } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    async function restore() {
      if (!refreshToken) {
        setRestoringSession(false);
        return;
      }

      try {
        await refreshAuthToken(refreshToken);
      } catch (err) {
        console.warn('Session restoration failed:', err);
        logout();
      } finally {
        if (isMounted) {
          setRestoringSession(false);
        }
      }
    }

    if (isRestoringSession && refreshToken) {
      restore();
    } else {
      setRestoringSession(false);
    }

    return () => {
      isMounted = false;
    };
  }, [refreshToken, isRestoringSession, setRestoringSession, logout]);

  return <>{children}</>;
};

export const AppProviders: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer>{children}</AuthInitializer>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
