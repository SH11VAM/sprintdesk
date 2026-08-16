import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';

// Route Code Splitting for heavy internal routes
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const BoardPage = lazy(() => import('@/pages/BoardPage'));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'));

const PageFallback: React.FC = () => (
  <div className="space-y-6 p-4 sm:p-6 animate-pulse">
    <div className="h-8 w-48 bg-surface-200 dark:bg-surface-800 rounded-lg" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="h-28 bg-surface-200 dark:bg-surface-800 rounded-2xl" />
      <div className="h-28 bg-surface-200 dark:bg-surface-800 rounded-2xl" />
      <div className="h-28 bg-surface-200 dark:bg-surface-800 rounded-2xl" />
      <div className="h-28 bg-surface-200 dark:bg-surface-800 rounded-2xl" />
    </div>
    <div className="h-72 bg-surface-200 dark:bg-surface-800 rounded-2xl" />
  </div>
);

export const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: <LoginPage />,
    },
    {
      path: '/',
      element: <ProtectedRoute />,
      children: [
        {
          element: <AppLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="/dashboard" replace />,
            },
            {
              path: 'dashboard',
              element: (
                <Suspense fallback={<PageFallback />}>
                  <DashboardPage />
                </Suspense>
              ),
            },
            {
              path: 'board',
              element: (
                <Suspense fallback={<PageFallback />}>
                  <BoardPage />
                </Suspense>
              ),
            },
            {
              path: 'analytics',
              element: (
                <Suspense fallback={<PageFallback />}>
                  <AnalyticsPage />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/dashboard" replace />,
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
