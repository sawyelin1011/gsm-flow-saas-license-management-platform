import type { ApiResponse } from "@shared/types";
const AUTH_KEY = 'gsm_flow_token';
export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_KEY, token);
}
export function getAuthToken() {
  return localStorage.getItem(AUTH_KEY);
}
export function clearAuthToken() {
  localStorage.removeItem(AUTH_KEY);
}
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  try {
    const res = await fetch(path, { ...init, headers: { ...headers, ...init?.headers } });
    if (res.status === 401) {
      clearAuthToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      throw new Error('Session expired');
    }
    const json = (await res.json()) as ApiResponse<T>;
    if (!res.ok || !json.success || json.data === undefined) {
      const error = new Error(json.error || `Error ${res.status}`);
      (error as any).code = json.code;
      throw error;
    }
    return json.data;
  } catch (err) {
    console.error('[API CLIENT ERROR]', err);
    throw err;
  }
}