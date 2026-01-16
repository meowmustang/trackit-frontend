export async function refreshToken(): Promise<string> {
  const res = await fetch('http://localhost:3000/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Refresh failed');

  const data = await res.json();
  return data.accessToken;
}
