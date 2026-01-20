import { refreshToken } from '../services/refreshToken';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

function forceLogout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
}

export async function authFetch(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> {
  const accessToken = localStorage.getItem('access_token');

  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {}),
    },
    credentials: 'include',
  });

  // ✅ Token still valid
  if (res.status !== 401) return res;

  // 🔁 Silent refresh (single flight)
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshToken();
  }

  try {
    const newAccessToken = await refreshPromise!;
    localStorage.setItem('access_token', newAccessToken);
  } catch {
    forceLogout();
    throw new Error('Session expired');
  } finally {
    isRefreshing = false;
  }

  // 🔁 Retry original request with new token
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    },
    credentials: 'include',
  });
}
