import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, User, Sparkles, KeyRound } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading, loginError } = useAuth();

  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

  const validate = () => {
    const newErrors: { username?: string; password?: string } = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login({ username, password });
      onSuccess?.();
    } catch {
      // Error handled in useAuth toast & loginError state
    }
  };

  const setDemoUser = (demoUser: string, demoPass: string) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {loginError && (
        <div
          role="alert"
          className="p-3.5 rounded-xl text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 flex items-start gap-2"
        >
          <span className="font-bold">Authentication failed:</span> {loginError.message}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Username"
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          placeholder="e.g. emilys"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) setErrors((prev) => ({ ...prev, username: undefined }));
          }}
          error={errors.username}
          leftIcon={<User className="w-4 h-4" aria-hidden="true" />}
          required
        />

        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          leftIcon={<Lock className="w-4 h-4" aria-hidden="true" />}
          required
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        className="w-full shadow-md shadow-brand-500/20"
        leftIcon={<KeyRound className="w-4 h-4" aria-hidden="true" />}
      >
        Sign In to SprintDesk
      </Button>

      {/* Quick Demo Credentials */}
      <div className="pt-4 border-t border-surface-200 dark:border-surface-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-medium text-surface-500 dark:text-surface-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            Quick Demo Accounts (DummyJSON):
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDemoUser('emilys', 'emilyspass')}
            className="px-2.5 py-1.5 text-xs text-left rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 hover:bg-surface-100 dark:bg-surface-800/60 dark:hover:bg-surface-800 transition-colors focus-ring"
          >
            <div className="font-semibold text-surface-900 dark:text-surface-100">Emily S.</div>
            <div className="text-[11px] text-surface-500">emilys / emilyspass</div>
          </button>
          <button
            type="button"
            onClick={() => setDemoUser('michaelw', 'michaelwpass')}
            className="px-2.5 py-1.5 text-xs text-left rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 hover:bg-surface-100 dark:bg-surface-800/60 dark:hover:bg-surface-800 transition-colors focus-ring"
          >
            <div className="font-semibold text-surface-900 dark:text-surface-100">Michael W.</div>
            <div className="text-[11px] text-surface-500">michaelw / michaelwpass</div>
          </button>
        </div>
      </div>
    </form>
  );
};
