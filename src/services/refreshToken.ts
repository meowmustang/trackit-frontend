export async function refreshToken(): Promise<string> {
  const res = await fetch('${API_BASE_URL}/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Refresh failed');

  const data = await res.json();
  return data.accessToken;
}
