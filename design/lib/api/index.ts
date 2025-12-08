/**
 * API Layer - Central Export
 * 
 * Single import point for all API-related functionality
 */

// Core API client
export { apiClient } from './client';
export { default as apiClient_default } from './client'; // For default imports

// API types
export type {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  ApiError,
  ResponseData,
  UnwrapAxios
} from './types';

// Type guards
export {
  isSuccessResponse,
  isErrorResponse,
  isApiError
} from './types';

// CSRF utilities
export { getCSRFToken, clearCSRFToken, hasCSRFToken } from './csrf';

// Event helpers (for ErrorProvider integration)
export {
  showError,
  showWarning,
  showSuccess,
  showInfo,
  showApiError,
  appEvents
} from '../events';

// Configuration
export { API_CONFIG } from '../config/api.config';

