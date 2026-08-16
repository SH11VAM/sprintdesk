import { authFetch } from './authInterceptor';
import { ApiError } from '@/types/common';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const fullPath = path.startsWith('http') ? path : `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    if (!params) return fullPath;

    const url = new URL(fullPath, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    return url.toString();
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers = {}, body, ...customConfig } = options;
    const url = this.buildUrl(path, params);

    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    const config: RequestInit = {
      ...customConfig,
      headers: {
        ...defaultHeaders,
        ...(headers as Record<string, string>),
      },
    };

    if (body && typeof body === 'object' && !(body instanceof FormData)) {
      config.body = JSON.stringify(body);
    } else if (body) {
      config.body = body as BodyInit;
    }

    const response = await authFetch(url, config);

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const message =
        (errorData as { message?: string })?.message ||
        `Request failed with status ${response.status}`;
      throw new ApiError(message, response.status, errorData);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  }

  get<T>(path: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'POST', body: data as BodyInit });
  }

  put<T>(path: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PUT', body: data as BodyInit });
  }

  patch<T>(path: string, data?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'PATCH', body: data as BodyInit });
  }

  delete<T>(path: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
