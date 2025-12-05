/**
 * API Configuration
 * Central configuration for all API-related settings
 */

import { getApiUrl } from './env';

export const API_CONFIG = {
  BASE_URL: getApiUrl(),
  TIMEOUT: 30000, // 30 seconds
  
  // Cookie settings
  WITH_CREDENTIALS: true,
  
  // CSRF settings
  CSRF_HEADER: 'X-CSRF-Token',
  CSRF_ENDPOINT: '/csrf-token',
  
  // Auth endpoints
  ENDPOINTS: {
    LOGIN: '/authentication/login',
    LOGOUT: '/authentication/logout',
    REFRESH: '/authentication/refresh',
    ME: '/authentication/me',
    CHANGE_PASSWORD: '/authentication/change-password',
  }
} as const;

export default API_CONFIG;

