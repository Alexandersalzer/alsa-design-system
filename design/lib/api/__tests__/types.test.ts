/**
 * Type System Tests
 * 
 * Dessa tester verifierar att:
 * 1. Type guards fungerar korrekt
 * 2. Types är kompatibla med befintlig kod
 * 3. Discriminated unions fungerar
 */

import { describe, it, expect } from '@jest/globals';
import {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  ApiError,
  isSuccessResponse,
  isErrorResponse,
  isApiError,
} from '../types';

describe('API Type System', () => {
  describe('isSuccessResponse', () => {
    it('should return true for success response', () => {
      const response: ApiResponse = {
        success: true,
        data: { items: [] },
      };

      expect(isSuccessResponse(response)).toBe(true);
    });

    it('should return false for error response', () => {
      const response: ApiResponse = {
        success: false,
        message: 'Error',
      };

      expect(isSuccessResponse(response)).toBe(false);
    });

    it('should handle null/undefined', () => {
      expect(isSuccessResponse(null)).toBe(false);
      expect(isSuccessResponse(undefined)).toBe(false);
    });
  });

  describe('isErrorResponse', () => {
    it('should return true for error response', () => {
      const response: ApiResponse = {
        success: false,
        message: 'Error occurred',
      };

      expect(isErrorResponse(response)).toBe(true);
    });

    it('should return false for success response', () => {
      const response: ApiResponse = {
        success: true,
      };

      expect(isErrorResponse(response)).toBe(false);
    });

    it('should handle null/undefined', () => {
      expect(isErrorResponse(null)).toBe(false);
      expect(isErrorResponse(undefined)).toBe(false);
    });
  });

  describe('isApiError', () => {
    it('should return true for Axios error', () => {
      const error: ApiError = {
        response: {
          data: { message: 'Server error' },
          status: 500,
        },
        message: 'Request failed',
      };

      expect(isApiError(error)).toBe(true);
    });

    it('should return true for error with message only', () => {
      const error = {
        message: 'Network error',
      };

      expect(isApiError(error)).toBe(true);
    });

    it('should return false for non-error objects', () => {
      expect(isApiError(null)).toBe(false);
      expect(isApiError(undefined)).toBe(false);
      expect(isApiError('string')).toBe(false);
      expect(isApiError(123)).toBe(false);
      expect(isApiError({})).toBe(false);
    });
  });

  describe('Type Compatibility', () => {
    it('should work with backend success structure', () => {
      // Backend: { success: true, domains: [...] }
      const backendResponse = {
        success: true,
        domains: [
          { id: 1, domain_name: 'example.com' },
        ],
      };

      expect(isSuccessResponse(backendResponse)).toBe(true);
    });

    it('should work with backend error structure', () => {
      // Backend: { success: false, message: '...' }
      const backendResponse = {
        success: false,
        message: 'Domain not found',
      };

      expect(isErrorResponse(backendResponse)).toBe(true);
    });

    it('should work with Axios response wrapper', () => {
      // Axios wraps in .data
      const axiosResponse = {
        data: {
          success: true,
          items: [],
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      };

      expect(isSuccessResponse(axiosResponse.data)).toBe(true);
    });
  });

  describe('Type Narrowing', () => {
    it('should narrow SuccessResponse type', () => {
      const response: ApiResponse<{ items: string[] }> = {
        success: true,
        data: { items: ['a', 'b'] },
      };

      if (isSuccessResponse(response)) {
        // TypeScript should know response.success is true
        expect(response.success).toBe(true);
        
        // TypeScript should allow accessing data
        expect(response.data?.items).toEqual(['a', 'b']);
      }
    });

    it('should narrow ErrorResponse type', () => {
      const response: ApiResponse = {
        success: false,
        message: 'Not found',
        error: 'RESOURCE_NOT_FOUND',
      };

      if (isErrorResponse(response)) {
        // TypeScript should know response.success is false
        expect(response.success).toBe(false);
        
        // TypeScript should require message field
        expect(response.message).toBe('Not found');
      }
    });
  });
});

// ============================================
// TYPE TESTS (Compile-time verification)
// ============================================

// These functions never run, they just verify types compile correctly

function _compileTimeTests() {
  // Test 1: ApiResponse can hold any data
  const test1: ApiResponse<{ users: any[] }> = {
    success: true,
    data: { users: [] },
  };

  // Test 2: SuccessResponse requires success: true
  const test2: SuccessResponse<{ id: number }> = {
    success: true, // Must be true
    data: { id: 123 },
  };

  // Test 3: ErrorResponse requires success: false and message
  const test3: ErrorResponse = {
    success: false, // Must be false
    message: 'Error', // Required
  };

  // Test 4: ApiError matches Axios error structure
  const test4: ApiError = {
    response: {
      data: { message: 'Server error', code: 'ERR_500' },
      status: 500,
    },
    message: 'Request failed',
  };

  // Test 5: Type guard narrows type correctly
  function narrowingTest(response: ApiResponse<{ value: string }>) {
    if (isSuccessResponse(response)) {
      // response is now SuccessResponse<{ value: string }>
      const value = response.data?.value; // ✅ Type-safe
      console.log(value);
    }

    if (isErrorResponse(response)) {
      // response is now ErrorResponse
      const msg = response.message; // ✅ Required field
      console.log(msg);
    }
  }

  // Suppress unused variable warnings
  void test1;
  void test2;
  void test3;
  void test4;
  void narrowingTest;
}

