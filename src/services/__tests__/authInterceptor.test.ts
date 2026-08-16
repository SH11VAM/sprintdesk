import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { authFetch } from '../authInterceptor';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ApiError } from '@/types/common';

describe('authFetch Interceptor', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    useAuthStore.getState().logout();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('attaches Bearer token to request headers if access token exists in store', async () => {
    useAuthStore.getState().login(
      { id: 1, username: 'testuser', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      'mock-access-token',
      'mock-refresh-token'
    );

    const mockFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    );
    global.fetch = mockFetch;

    await authFetch('https://api.example.com/data');

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const calledInit = mockFetch.mock.calls[0][1] as RequestInit;
    const headers = new Headers(calledInit.headers);
    expect(headers.get('Authorization')).toBe('Bearer mock-access-token');
  });

  it('handles 401 response, refreshes token, and retries original request with new token', async () => {
    useAuthStore.getState().login(
      { id: 1, username: 'testuser', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      'expired-token',
      'valid-refresh-token'
    );

    const mockFetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();

      // 1. Initial data request -> 401 Unauthorized
      if (url.includes('/data') && !url.includes('retry')) {
        // First time /data is called with expired token
        if (mockFetch.mock.calls.length === 1) {
          return Promise.resolve(new Response(JSON.stringify({ message: 'Token expired' }), { status: 401 }));
        }
        // Second time /data is called after token refresh
        return Promise.resolve(
          new Response(JSON.stringify({ data: 'secret payload' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }

      // 2. Token refresh request -> 200 OK with new tokens
      if (url.includes('/auth/refresh')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              accessToken: 'fresh-new-token',
              refreshToken: 'fresh-refresh-token',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          )
        );
      }

      return Promise.resolve(new Response('{}', { status: 200 }));
    });

    global.fetch = mockFetch;

    const response = await authFetch('https://api.example.com/data');
    const json = await response.json();

    expect(json.data).toBe('secret payload');
    expect(mockFetch).toHaveBeenCalledTimes(3); // 1. original 401 -> 2. refresh -> 3. retried request
    expect(useAuthStore.getState().accessToken).toBe('fresh-new-token');
  });

  it('triggers logout and throws ApiError when refresh token fails', async () => {
    useAuthStore.getState().login(
      { id: 1, username: 'testuser', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      'expired-token',
      'invalid-refresh-token'
    );

    const mockFetch = vi.fn().mockImplementation((input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (url.includes('/data')) {
        return Promise.resolve(new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 }));
      }
      if (url.includes('/auth/refresh')) {
        return Promise.resolve(new Response(JSON.stringify({ message: 'Invalid refresh token' }), { status: 401 }));
      }
      return Promise.resolve(new Response('{}', { status: 200 }));
    });

    global.fetch = mockFetch;

    await expect(authFetch('https://api.example.com/data')).rejects.toThrow(ApiError);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
