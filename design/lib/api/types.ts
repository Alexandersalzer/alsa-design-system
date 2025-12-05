/**
 * Centralized API Response Types for Blimpify IM Dashboard
 * 
 * Backend structure (im-api):
 * - Success: { success: true, [data fields], message? }
 * - Error:   { success: false, message, error? }
 * 
 * This aligns frontend typing to backend structure.
 * Fully compatible with apiClient and ErrorProvider.
 * 
 * Usage:
 * 
 * @example
 * import { ApiResponse, isSuccessResponse } from '@/lib/api';
 * 
 * type DomainsData = { domains: Domain[] };
 * type DomainsResponse = ApiResponse<DomainsData>;
 * 
 * const response = await apiClient.get<DomainsResponse>('/domains');
 * if (isSuccessResponse(response.data)) {
 *   // TypeScript knows: response.data.success = true
 *   const domains = response.data.data?.domains;
 * }
 * 
 * @note
 * Existing service functions continue to work as-is:
 * - Services return `response.data` directly
 * - Components can use specialized Response types
 * - No breaking changes to existing code
 */

// ============================================
// BASE API RESPONSE TYPES
// ============================================

/**
 * Base API response structure
 * Mirrors backend { success, message, error, data } pattern
 * 
 * @template T - Type of the data payload (optional)
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

/**
 * Success response type (type-safe discriminated union)
 * Guaranteed to have success: true
 */
export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data?: T;
}

/**
 * Error response type (type-safe discriminated union)
 * Guaranteed to have success: false and message
 */
export interface ErrorResponse extends ApiResponse {
  success: false;
  message: string;
  error?: string;
}

/**
 * API Error structure (from Axios)
 * Used in catch blocks to type error objects
 */
export interface ApiError {
  response?: {
    data?: {
      message?: string;
      code?: string;
      error?: string;
    };
    status?: number;
  };
  message?: string;
  code?: string;
  name?: string;
}

// ============================================
// TYPE GUARDS
// ============================================

/**
 * Type guard to check if response is successful
 * Narrows type to SuccessResponse<T>
 * 
 * @example
 * const response = await apiClient.get('/endpoint');
 * if (isSuccessResponse(response.data)) {
 *   // TypeScript knows: response.data.success === true
 *   console.log(response.data.data);
 * }
 */
export function isSuccessResponse<T = any>(
  response: ApiResponse<T> | null | undefined
): response is SuccessResponse<T> {
  return response?.success === true;
}

/**
 * Type guard to check if response is an error
 * Narrows type to ErrorResponse
 */
export function isErrorResponse(
  response: ApiResponse | null | undefined
): response is ErrorResponse {
  return response?.success === false;
}

/**
 * Type guard to check if error is ApiError
 */
export function isApiError(error: any): error is ApiError {
  return (
    error &&
    typeof error === 'object' &&
    ('response' in error || 'message' in error)
  );
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Extract data type from a response type
 * 
 * @example
 * type MyResponse = ApiResponse<{ items: Item[] }>;
 * type MyData = ResponseData<MyResponse>; // { items: Item[] }
 */
export type ResponseData<T extends ApiResponse<any>> = 
  T extends ApiResponse<infer D> ? D : never;

/**
 * Unwrap Axios response to get API response
 * 
 * @example
 * type AxiosData = AxiosResponse<DomainsResponse>;
 * type ApiData = UnwrapAxios<AxiosData>; // DomainsResponse
 */
export type UnwrapAxios<T> = T extends { data: infer D } ? D : T;

// ============================================
// TODO: FUTURE ENHANCEMENTS
// ============================================

/*
 * Future wrapper layer for even better DX:
 * 
 * export const api = {
 *   async get<T>(url: string): Promise<ApiResponse<T>> {
 *     const response = await apiClient.get(url);
 *     return response.data;
 *   },
 *   
 *   async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
 *     const response = await apiClient.post(url, data);
 *     return response.data;
 *   },
 *   
 *   // ... put, delete, patch
 * };
 * 
 * Benefits:
 * - Automatically unwraps response.data
 * - Type-safe by default
 * - Consistent usage everywhere
 * 
 * Migration:
 * - Replace `apiClient.get()` with `api.get()`
 * - No other changes needed
 */

