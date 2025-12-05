/**
 * API Client with Cookie & CSRF Support
 * Central axios instance with automatic cookie handling
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '@/lib/config/api.config';
import { getCSRFToken, clearCSRFToken } from './csrf';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  withCredentials: true, // 🔑 Send cookies automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

// Track if we're currently refreshing
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * Subscribe to token refresh
 */
function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

/**
 * Notify all subscribers when token is refreshed
 */
function onTokenRefreshed() {
  refreshSubscribers.forEach((cb) => cb('refreshed'));
  refreshSubscribers = [];
}

// ============================================
// REQUEST INTERCEPTOR
// ============================================

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add CSRF token for state-changing operations
    const method = config.method?.toLowerCase();
    const needsCSRF = ['post', 'put', 'patch', 'delete'].includes(method || '');
    
    if (needsCSRF) {
      try {
        const csrfToken = await getCSRFToken();
        config.headers[API_CONFIG.CSRF_HEADER] = csrfToken;
      } catch (error) {
        console.warn('Failed to get CSRF token:', error);
        // Continue without CSRF token - server will reject if needed
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// RESPONSE INTERCEPTOR
// ============================================

apiClient.interceptors.response.use(
  (response) => {
    // ⚡ AUTO SUCCESS FEEDBACK
    if (typeof window !== 'undefined') {
      const method = response.config?.method?.toUpperCase();
      const isWriteOperation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method || '');
      const config = response.config as InternalAxiosRequestConfig & { meta?: { noSuccessToast?: boolean } };
      const optedOut = config.meta?.noSuccessToast === true;
      
      if (isWriteOperation && !optedOut) {
        const data = response.data as any;
        if (data?.success === true && data?.message) {
          window.dispatchEvent(new CustomEvent('app:success', {
            detail: { message: data.message }
          }));
        }
      }
    }
    
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      // Skip refresh for auth endpoints
      const skipRefreshPaths = ['/authentication/login', '/authentication/me', '/authentication/refresh'];
      const shouldSkipRefresh = skipRefreshPaths.some(path => originalRequest.url?.includes(path));
      
      if (shouldSkipRefresh) {
        return Promise.reject(error);
      }
      
      // If already refreshing, wait for it
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(apiClient(originalRequest));
          });
        });
      }
      
      // Mark as retrying
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Attempt token refresh (silent - no success toast)
        await apiClient.post(API_CONFIG.ENDPOINTS.REFRESH, {}, {
          meta: { noSuccessToast: true }
        } as any);
        
        // Refresh successful
        isRefreshing = false;
        
        // Small delay to ensure cookie is set before retry
        await new Promise(resolve => setTimeout(resolve, 100));
        
        onTokenRefreshed();
        
        // Retry original request
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - session expired
        isRefreshing = false;
        refreshSubscribers = [];
        
        // Clear CSRF token
        clearCSRFToken();
        
        // Dispatch auth expired event (only if user was logged in)
        if (typeof window !== 'undefined') {
          // 🔍 Safari Cookie Debug
          if (process.env.NODE_ENV === 'development') {
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            console.warn('[Token Refresh Failed]', {
              browser: isSafari ? 'Safari (ITP may block cookies)' : 'Other',
              timestamp: Date.now(),
              hint: isSafari ? 'Safari ITP blocks cross-origin cookies. Use Chrome for development or configure same-domain.' : null
            });
          }
          
          window.dispatchEvent(new CustomEvent('authExpired', {
            detail: {
              reason: 'Token refresh failed',
              timestamp: Date.now()
            }
          }));
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Handle 403 CSRF error
    if (error.response?.status === 403) {
      const errorData = error.response.data as any;
      if (errorData?.code === 'CSRF_ERROR' || errorData?.message?.includes('CSRF')) {
        // Clear cached CSRF token and retry once
        if (!originalRequest._retry) {
          clearCSRFToken();
          originalRequest._retry = true;
          return apiClient(originalRequest);
        }
      }
    }
    
    // ⚡ GLOBAL ERROR EVENTS - Dispatcha för ErrorProvider
    if (typeof window !== 'undefined') {
      const status = error.response?.status;
      const errorData = error.response?.data as any;
      const userMessage = getUserFriendlyMessage(status, errorData);
      
      const config = originalRequest as InternalAxiosRequestConfig & { meta?: { noErrorToast?: boolean } };
      const optedOut = config.meta?.noErrorToast === true;
      const isGetRequest = originalRequest.method?.toUpperCase() === 'GET';
      
      // Dispatcha event om det är ett användbart fel att visa
      // (inte 401/403, inte 404 på GET, inte om opted out)
      const shouldShowToast = status && 
        status !== 401 && 
        status !== 403 && 
        !(status === 404 && isGetRequest) && 
        !optedOut;
      
      if (shouldShowToast) {
        window.dispatchEvent(new CustomEvent('app:error', {
          detail: {
            message: userMessage,
            technical: errorData?.message || error.message,
            context: `API: ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`
          }
        }));
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Översätt HTTP status codes till användarvänliga meddelanden
 */
function getUserFriendlyMessage(status?: number, errorData?: any): string {
  // Om backend har ett användarvänligt meddelande, använd det
  if (errorData?.message && typeof errorData.message === 'string') {
    return errorData.message;
  }
  
  // Annars, standardmeddelanden baserat på status
  const messages: Record<number, string> = {
    400: 'Ogiltig förfrågan. Kontrollera dina uppgifter.',
    404: 'Det du söker kunde inte hittas.',
    500: 'Ett serverfel inträffade. Försök igen senare.',
    502: 'Servern är tillfälligt otillgänglig.',
    503: 'Tjänsten är under underhåll. Försök igen om en stund.',
    504: 'Servern svarade inte i tid. Försök igen.'
  };
  
  return status ? messages[status] || 'Ett oväntat fel inträffade.' : 'Ingen anslutning till servern.';
}

export default apiClient;

