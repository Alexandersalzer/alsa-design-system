/**
 * Environment Variable Validator
 * Validates required environment variables and provides safe access
 */

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Get required environment variable
 * Throws error in production if missing, uses fallback in development
 */
export function getRequiredEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  
  if (!value) {
    if (isProduction) {
      throw new Error(
        `Missing required environment variable: ${key}. ` +
        `This must be set in your production environment.`
      );
    }
    
    if (fallback) {
      if (isDevelopment) {
        console.warn(
          `[Env] Using fallback for ${key}. Set ${key} in your .env.local file.`
        );
      }
      return fallback;
    }
    
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `No fallback provided.`
    );
  }
  
  return value;
}

/**
 * Get optional environment variable
 * Returns undefined if not set, never throws
 */
export function getOptionalEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * Validate API URL
 * Ensures NEXT_PUBLIC_API_URL is set in production
 * 
 * Smart detection:
 * - If NEXT_PUBLIC_API_URL is set, use it (always wins)
 * - Production: If not set, use devapi.blimpify-im.com as default
 * - Development: Use localhost:8081 as fallback
 */
export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // If explicitly set, use it (always wins)
  if (envUrl) {
    // Ensure URL ends with /api for consistency
    const cleanUrl = envUrl.trim();
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  }
  
  // Production mode: use smart default if not set
  if (isProduction) {
    // Default production API URL
    const defaultProdUrl = 'https://devapi.blimpify-im.com/api';
    console.warn(
      `[API Config] NEXT_PUBLIC_API_URL not set in production. ` +
      `Using default: ${defaultProdUrl}. ` +
      `Set NEXT_PUBLIC_API_URL env var to override.`
    );
    return defaultProdUrl;
  }
  
  // Development: use localhost fallback
  if (isDevelopment) {
    console.warn(
      `[API Config] NEXT_PUBLIC_API_URL not set in development. ` +
      `Using fallback: http://localhost:8081/api. ` +
      `Set NEXT_PUBLIC_API_URL in .env.local to override.`
    );
  }
  return 'http://localhost:8081/api';
}

/**
 * Validate all required environment variables
 * Call this at app startup to catch missing vars early
 */
export function validateEnvironment(): void {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required in production
  if (isProduction) {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      errors.push('NEXT_PUBLIC_API_URL is required in production');
    }
  } else {
    // Optional in development but warn if missing
    if (!process.env.NEXT_PUBLIC_API_URL) {
      warnings.push('NEXT_PUBLIC_API_URL not set, using localhost fallback');
    }
  }
  
  // Optional but recommended
  if (!process.env.NEXT_PUBLIC_APP_NAME) {
    warnings.push('NEXT_PUBLIC_APP_NAME not set (optional but recommended)');
  }
  
  if (!process.env.NEXT_PUBLIC_APP_VERSION) {
    warnings.push('NEXT_PUBLIC_APP_VERSION not set (optional but recommended)');
  }
  
  // Sentry (optional)
  if (process.env.NEXT_PUBLIC_USE_SENTRY === 'true' && !process.env.NEXT_PUBLIC_SENTRY_DSN) {
    warnings.push('NEXT_PUBLIC_USE_SENTRY is true but NEXT_PUBLIC_SENTRY_DSN is not set');
  }
  
  // Log warnings in development
  if (isDevelopment && warnings.length > 0) {
    console.warn('[Env Validation] Warnings:', warnings);
  }
  
  // Throw errors in production
  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed:\n${errors.join('\n')}`
    );
  }
}

/**
 * Environment configuration object
 */
export const env = {
  // API
  API_URL: getApiUrl(),
  
  // App info
  APP_NAME: getOptionalEnv('NEXT_PUBLIC_APP_NAME', 'dashboard'),
  APP_VERSION: getOptionalEnv('NEXT_PUBLIC_APP_VERSION', 'unknown'),
  ENVIRONMENT: getOptionalEnv('NEXT_PUBLIC_ENVIRONMENT', process.env.NODE_ENV || 'development'),
  
  // Sentry
  USE_SENTRY: process.env.NEXT_PUBLIC_USE_SENTRY === 'true',
  SENTRY_DSN: getOptionalEnv('NEXT_PUBLIC_SENTRY_DSN'),
  SENTRY_RELEASE: getOptionalEnv('NEXT_PUBLIC_SENTRY_RELEASE', process.env.NEXT_PUBLIC_APP_VERSION),
  
  // Runtime
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: isProduction,
  IS_DEVELOPMENT: isDevelopment,
} as const;

// Validate on module load (only in production or if explicitly enabled)
if (typeof window === 'undefined' && (isProduction || process.env.VALIDATE_ENV === 'true')) {
  try {
    validateEnvironment();
  } catch (error) {
    console.error('[Env] Validation failed:', error);
    // In production, we want to fail fast
    if (isProduction) {
      throw error;
    }
  }
}

