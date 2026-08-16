import { create } from 'zustand';
import { AuthState, AuthUser } from '../types';
import { storage } from '@/services/storage';

const REFRESH_TOKEN_KEY = 'sprintdesk_refresh_token';
const USER_PROFILE_KEY = 'sprintdesk_user_profile';

const initialRefreshToken = storage.get<string | null>(REFRESH_TOKEN_KEY, null);
const initialUser = storage.get<AuthUser | null>(USER_PROFILE_KEY, null);

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  accessToken: null,
  refreshToken: initialRefreshToken,
  isAuthenticated: false,
  isRestoringSession: Boolean(initialRefreshToken),

  login: (user: AuthUser, accessToken: string, refreshToken?: string) => {
    if (refreshToken) {
      storage.set(REFRESH_TOKEN_KEY, refreshToken);
    }
    storage.set(USER_PROFILE_KEY, user);

    set({
      user,
      accessToken,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
      isRestoringSession: false,
    });
  },

  setAccessToken: (accessToken: string) => {
    set({ accessToken, isAuthenticated: true });
  },

  logout: () => {
    storage.remove(REFRESH_TOKEN_KEY);
    storage.remove(USER_PROFILE_KEY);

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isRestoringSession: false,
    });
  },

  setRestoringSession: (isRestoring: boolean) => {
    set({ isRestoringSession: isRestoring });
  },
}));
