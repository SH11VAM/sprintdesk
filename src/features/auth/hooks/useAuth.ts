import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/authApi';
import { LoginCredentials } from '../types';
import { useToast } from '@/hooks/useToast';

export function useAuth() {
  const { user, accessToken, isAuthenticated, isRestoringSession, login, logout } =
    useAuthStore();
  const { success, error: toastError } = useToast();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      login(data.user, data.tokens.accessToken, data.tokens.refreshToken);
      success('Welcome back!', `Logged in as ${data.user.firstName} ${data.user.lastName}`);
    },
    onError: (err: Error) => {
      toastError('Login Failed', err.message || 'Invalid username or password');
    },
  });

  return {
    user,
    accessToken,
    isAuthenticated,
    isRestoringSession,
    login: loginMutation.mutateAsync,
    isLoading: loginMutation.isPending,
    loginError: loginMutation.error as Error | null,
    logout,
  };
}
