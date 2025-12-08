/**
 * CSRF Token Management
 * Handles fetching and caching of CSRF tokens
 */

import { API_CONFIG } from '@/lib/config/api.config';

let csrfToken: string | null = null;
let csrfPromise: Promise<string> | null = null;

/**
 * Get CSRF token (cached)
 * Fetches token from server if not cached
 */
export async function getCSRFToken(): Promise<string> {
  // Return cached token if available
  if (csrfToken) {
    return csrfToken;
  }
  
  // Wait for existing fetch if in progress
  if (csrfPromise) {
    return csrfPromise;
  }
  
  // Fetch new token from server
  csrfPromise = fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.CSRF_ENDPOINT}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch CSRF token');
      }
      const data = await res.json();
      csrfToken = data.csrfToken;
      csrfPromise = null;
      return csrfToken!;
    })
    .catch((err) => {
      csrfPromise = null;
      throw err;
    });
  
  return csrfPromise;
}

/**
 * Clear cached CSRF token
 * Call this on logout or when token becomes invalid
 */
export function clearCSRFToken(): void {
  csrfToken = null;
  csrfPromise = null;
}

/**
 * Check if we have a CSRF token cached
 */
export function hasCSRFToken(): boolean {
  return csrfToken !== null;
}

