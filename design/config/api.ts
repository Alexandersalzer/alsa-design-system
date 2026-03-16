/**
 * API Configuration - Single Source of Truth
 * 
 * This file manages all API URLs for the blimpify-ui package.
 * 
 * Build-time configuration:
 * - Production builds: Uses NEXT_PUBLIC_API_URL from environment or defaults to production API
 * - Development builds: Uses NEXT_PUBLIC_API_URL from workspace .env.local
 * 
 * Development hostname override:
 * - NEXT_PUBLIC_DEV_HOSTNAME: Override X-Origin-Host header in development
 * - Example: NEXT_PUBLIC_DEV_HOSTNAME=kjmarketingsweden.com
 * - Only used in development, ignored in production
 * 
 * SECURITY DESIGN:
 * - Never defaults to dev API (always failsafe to production)
 * - Environment variable is replaced at build time by Next.js (becomes static string)
 * - No runtime URL injection (all URLs baked into static files)
 * 
 * @author Blimpify
 * @since 2026-01-19
 */

/**
 * Production API URL (default failsafe)
 */
const DEFAULT_PROD_API = 'https://api.blimpify-im.com';

/**
 * Get API base URL
 * 
 * Resolution order:
 * 1. NEXT_PUBLIC_API_URL from environment (set by consuming application)
 * 2. FAILSAFE: Production API (never defaults to dev for security)
 * 
 * @returns API base URL (e.g., "https://api.blimpify-im.com")
 */
export function getApiUrl(): string {
  // 1. Build-time environment variable (set by consuming app)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // 2. FAILSAFE: Always default to production (NEVER dev)
  return DEFAULT_PROD_API;
}

/**
 * Get hostname for X-Origin-Host header
 * 
 * In development, allows overriding hostname to test specific clients
 * In production, uses window.location.hostname
 * 
 * @returns Hostname (e.g., "kjmarketingsweden.com" or "cicir.onblimpify.com")
 */
export function getHostname(): string {
  // 1. Development override (only if explicitly set)
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_DEV_HOSTNAME) {
    return process.env.NEXT_PUBLIC_DEV_HOSTNAME;
  }
  
  // 2. Production: Use actual hostname
  if (typeof window !== 'undefined') {
    return window.location.hostname;
  }
  
  // 3. SSR fallback (should not be used for client-side API calls)
  return '';
}

/**
 * Static API URL constant (resolved at build time)
 * Use this for modules that need a constant value
 */
export const API_URL = getApiUrl();

/**
 * API endpoint paths
 * Centralized endpoint configuration
 */
export const API_ENDPOINTS = {
  analytics: {
    track: '/api/v1/analytics/track',
  },
  actions: {
    base: '/api/v1/actions',
    contact: '/api/v1/actions/contact',
    newsletter: '/api/v1/actions/newsletter',
    booking: '/api/v1/actions/booking',
    form: '/api/v1/actions/form',
  },
  public: {
    base: '/api/public',
  },
} as const;

/**
 * Get full API endpoint URL
 * @param endpoint - Endpoint path (e.g., '/api/v1/analytics/track')
 * @returns Full URL (e.g., 'https://api.blimpify-im.com/api/v1/analytics/track')
 */
export function getEndpointUrl(endpoint: string): string {
  const baseUrl = getApiUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
}
