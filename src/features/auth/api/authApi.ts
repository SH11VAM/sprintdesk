import { apiClient } from '@/services/apiClient';
import {
  LoginCredentials,
  DummyJsonLoginResponse,
  AuthUser,
  AuthTokens,
} from '../types';

const AUTH_URL = import.meta.env.VITE_AUTH_API_URL;

export const authApi = {
  async login(credentials: LoginCredentials): Promise<{ user: AuthUser; tokens: AuthTokens }> {
    const response = await apiClient.post<DummyJsonLoginResponse>(
      `${AUTH_URL}/auth/login`,
      {
        username: credentials.username.trim(),
        password: credentials.password,
        expiresInMins: credentials.expiresInMins ?? 60,
      }
    );

    const accessToken = response.accessToken || response.token || '';
    const refreshToken = response.refreshToken || '';

    const user: AuthUser = {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      gender: response.gender,
      image: response.image,
    };

    return {
      user,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  },

  async getAuthMe(token: string): Promise<AuthUser> {
    const response = await apiClient.get<DummyJsonLoginResponse>(`${AUTH_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      id: response.id,
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      gender: response.gender,
      image: response.image,
    };
  },
};
