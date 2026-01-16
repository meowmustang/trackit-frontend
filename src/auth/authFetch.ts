import { refreshToken } from '../services/refreshToken';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

function forceLogout() {
  localStorage.removeItem('trackit_token');
  window.location.href = '/login';
}


export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> {
  const token = localStorage.getItem('trackit_token');

  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: token ? `Bearer ${token}` : '',
    },
    credentials: 'include', // REQUIRED for refresh cookie
  });

  if (res.status !== 401) return res;

  // 🔁 Silent refresh
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshToken();
  }

  try {
    const newToken = await refreshPromise!;
    localStorage.setItem('trackit_token', newToken);
  } catch {
    forceLogout();
    throw new Error('Session expired');
  } finally {
    isRefreshing = false;
  }

  
  // 🔁 Retry original request
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${localStorage.getItem('trackit_token')}`,
    },
    credentials: 'include',
  });
}
