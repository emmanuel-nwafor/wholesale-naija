// utils/fetchWithToken.ts

export interface FetchWithTokenOptions extends RequestInit {
  headers?: Record<string, string>;
  timeout?: number;
  onShowLoginAlert?: () => void;
}

export async function fetchWithToken<T = unknown>(
  endpoint: string,
  options: FetchWithTokenOptions = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const BASE_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'https://wholesalenaija-backend-9k01.onrender.com/api';

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers || {}),
  };

  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = options.timeout || 20000;
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!res.ok) {
      const errorText = await res.text();

      if (res.status === 401 && !token && options.onShowLoginAlert) {
        options.onShowLoginAlert();
        throw new Error('login-required');
      }

      throw new Error(
        `Request failed (${res.status}): ${errorText || res.statusText}`
      );
    }

    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return (await res.json()) as T;
    }

    return (await res.text()) as unknown as T;
  } catch (err: unknown) {
    const error = err as Error; 
    
    if (error.name === 'AbortError') {
      console.warn('Request timed out');
      throw new Error('Request timeout. Please try again.');
    }

    console.error('FetchWithToken error:', err);

    throw err instanceof Error ? err : new Error('Network error');
  } finally {
    clearTimeout(timeoutId);
  }
}