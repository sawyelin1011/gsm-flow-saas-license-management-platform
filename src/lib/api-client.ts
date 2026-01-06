import type { ApiResponse } from "@shared/types";
/**
 * Enhanced API client with robust error handling for network failures,
 * worker cold starts, and structured API errors.
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const res = await fetch(path, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      ...init
    });
    let json: ApiResponse<T>;
    try {
      json = (await res.json()) as ApiResponse<T>;
    } catch (parseError) {
      console.error('[API CLIENT] Parse Error:', parseError);
      throw new Error(`Invalid server response (Status: ${res.status})`);
    }
    if (!res.ok || !json.success || json.data === undefined) {
      const errorMessage = json.error || `Request failed with status ${res.status}`;
      console.warn(`[API CLIENT] Error ${res.status}:`, errorMessage);
      throw new Error(errorMessage);
    }
    return json.data;
  } catch (err) {
    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      console.error('[API CLIENT] Network Error: Check internet connection or CORS settings.');
      throw new Error('Network error: Unable to reach the licensing authority.');
    }
    // Re-throw if it's already an error we processed or a generic error
    throw err instanceof Error ? err : new Error('An unexpected error occurred');
  }
}