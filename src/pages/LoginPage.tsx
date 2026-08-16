import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Layers, ShieldCheck, Zap, BarChart2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, isRestoringSession } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated && !isRestoringSession) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isRestoringSession, navigate, from]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-surface-50 dark:bg-surface-950 p-4 sm:p-6 lg:p-8 selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white shadow-xl shadow-brand-500/25 mb-1">
            <Layers className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-surface-900 dark:text-surface-50 tracking-tight">
            Sprint<span className="text-brand-600 dark:text-brand-400">Desk</span>
          </h1>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Sign in to manage active sprints, tasks, and velocity analytics
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-6 sm:p-8 shadow-soft-xl">
          <LoginForm onSuccess={() => navigate(from, { replace: true })} />
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-surface-500 dark:text-surface-400">
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/50 dark:bg-surface-900/50 border border-surface-200/50 dark:border-surface-800/50">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>JWT Refresh</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/50 dark:bg-surface-900/50 border border-surface-200/50 dark:border-surface-800/50">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Fluid Dnd</span>
          </div>
          <div className="flex flex-col items-center gap-1 p-2 rounded-xl bg-white/50 dark:bg-surface-900/50 border border-surface-200/50 dark:border-surface-800/50">
            <BarChart2 className="w-4 h-4 text-brand-500" />
            <span>Real Analytics</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
