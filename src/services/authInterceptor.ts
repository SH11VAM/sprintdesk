import { useAuthStore } from '@/features/auth/store/authStore';
import { ApiError } from '@/types/common';
import { DummyJsonRefreshResponse } from '@/features/auth/types';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Refreshes the auth token against the backend auth endpoint.
 */
export async function refreshAuthToken(refreshToken: string): Promise<string> {
  const authUrl = import.meta.env.VITE_AUTH_API_URL || 'https://dummyjson.com';
  const response = await fetch(`${authUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refreshToken,
      expiresInMins: 30,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(errorData.message || 'Token refresh failed', response.status, errorData);
  }

  const data: DummyJsonRefreshResponse = await response.json();
  const newAccessToken = data.accessToken || data.token;
  const newRefreshToken = data.refreshToken;

  if (!newAccessToken) {
    throw new ApiError('No access token returned from refresh endpoint', 500);
  }

  useAuthStore.getState().setAccessToken(newAccessToken);
  if (newRefreshToken) {
    useAuthStore.getState().login(
      useAuthStore.getState().user!,
      newAccessToken,
      newRefreshToken
    );
  }

  return newAccessToken;
}

/**
 * Intercepted fetch wrapper that manages Bearer token injection, 401 interception,
 * token refresh queuing, and retry mechanism.
 */
export async function authFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
  isRetry = false
): Promise<Response> {
  const token = useAuthStore.getState().accessToken;

  // Build headers with existing auth token if available
  const headers = new Headers(init.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const enhancedInit: RequestInit = {
    ...init,
    headers,
  };

  let response: Response;
  try {
    response = await fetch(input, enhancedInit);
  } catch (networkError) {
    throw new ApiError('Network error. Please check your internet connection.', 0, networkError);
  }

  // Handle 401 Unauthorized
  if (response.status === 401 && !isRetry) {
    const currentRefreshToken = useAuthStore.getState().refreshToken;

    if (!currentRefreshToken) {
      useAuthStore.getState().logout();
      throw new ApiError('Session expired. Please log in again.', 401);
    }

    if (isRefreshing) {
      // Queue this request until current refresh finishes
      try {
        const newToken = await new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
        const retryHeaders = new Headers(init.headers || {});
        retryHeaders.set('Authorization', `Bearer ${newToken}`);
        return authFetch(input, { ...init, headers: retryHeaders }, true);
      } catch (err) {
        useAuthStore.getState().logout();
        throw err;
      }
    }

    isRefreshing = true;

    try {
      const newToken = await refreshAuthToken(currentRefreshToken);
      processQueue(null, newToken);

      const retryHeaders = new Headers(init.headers || {});
      retryHeaders.set('Authorization', `Bearer ${newToken}`);
      return await authFetch(input, { ...init, headers: retryHeaders }, true);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      useAuthStore.getState().logout();
      throw new ApiError('Session expired. Please log in again.', 401, refreshErr);
    } finally {
      isRefreshing = false;
    }
  }

  return response;
}
