/**
 * logger.ts - Unified Logging System (Frontend)
 * 
 * Centralized logging interface that supports multiple backends:
 * - Sentry (for production error tracking)
 * - Console (for development)
 * - Future: Custom internal logging API
 * 
 * @author Blimpify IM Team
 * @since 2025-11-11
 */

export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LogEventOptions {
  message: string;
  data?: Record<string, any>;
  error?: Error | unknown;
  context?: string;
  userId?: string | number;
  tags?: Record<string, string>;
}

/**
 * Get standard tags that are automatically included in all logs
 */
const getStandardTags = (): Record<string, string> => {
  return {
    env: process.env.NODE_ENV || 'development',
    app: process.env.NEXT_PUBLIC_APP_NAME || 'dashboard',
    version: process.env.NEXT_PUBLIC_APP_VERSION || process.env.NEXT_PUBLIC_SENTRY_RELEASE || 'unknown',
  };
};

/**
 * Merge user tags with standard tags (user tags take precedence)
 */
const mergeTags = (userTags?: Record<string, string>): Record<string, string> => {
  const standardTags = getStandardTags();
  return { ...standardTags, ...userTags };
};

/**
 * Check if Sentry is enabled and available
 */
const isSentryEnabled = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    process.env.NEXT_PUBLIC_USE_SENTRY === 'true' &&
    !!process.env.NEXT_PUBLIC_SENTRY_DSN
  );
};

/**
 * Dynamically import Sentry (only when needed)
 * Note: Install with `npm install @sentry/nextjs` before enabling
 */
let sentryModule: any = null;
const getSentry = async () => {
  if (!sentryModule) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - Sentry is optional dependency
      sentryModule = await import('@sentry/nextjs');
    } catch {
      console.warn('[Logger] @sentry/nextjs not installed - run: npm install @sentry/nextjs');
      sentryModule = null;
    }
  }
  return sentryModule;
};

/**
 * Main logging function - routes to appropriate backend
 * 
 * @example
 * ```typescript
 * // Simple message
 * logEvent({ message: 'User logged in' });
 * 
 * // With data context
 * logEvent({ 
 *   message: 'Payment processed', 
 *   data: { amount: 1000, currency: 'SEK' }
 * });
 * 
 * // Error logging
 * try {
 *   await riskyOperation();
 * } catch (error) {
 *   logEvent({ 
 *     message: 'Operation failed', 
 *     error,
 *     context: 'PaymentFlow'
 *   }, 'error');
 * }
 * ```
 */
export async function logEvent(
  options: LogEventOptions,
  level: LogLevel = 'info'
): Promise<void> {
  const { message, data, error, context, userId, tags } = options;

  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    const logMethod = console[level] || console.log;
    const emoji = {
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🐛'
    }[level];

    logMethod(
      `${emoji} [${context || 'App'}] ${message}`,
      data ? data : '',
      error ? error : ''
    );
  }

  // Route to Sentry if enabled
  if (isSentryEnabled()) {
    try {
      const Sentry = await getSentry();
      if (!Sentry) return; // Skip if not installed

      // Set user context if provided
      if (userId) {
        Sentry.setUser({ id: String(userId) });
      }

      // Merge standard tags with custom tags
      const mergedTags = mergeTags(tags);
      Sentry.setTags(mergedTags);

      // Add context as breadcrumb
      if (context) {
        Sentry.addBreadcrumb({
          category: context,
          message,
          level: level === 'error' ? 'error' : level === 'warn' ? 'warning' : 'info',
          data
        });
      }

      // Handle error vs message
      if (level === 'error' && error) {
        // Capture exception with additional context
        Sentry.captureException(error, {
          level: 'error',
          tags: { context: context || 'unknown', ...tags },
          extra: { message, ...data }
        });
      } else {
        // Capture message with appropriate severity
        Sentry.captureMessage(message, {
          level: level === 'warn' ? 'warning' : level === 'error' ? 'error' : 'info',
          tags: { context: context || 'unknown', ...tags },
          extra: data
        });
      }
    } catch (sentryError) {
      // Fallback if Sentry fails to load
      console.error('[Logger] Sentry error:', sentryError);
    }
  }

  // TODO: Add custom internal logging API here
  // if (process.env.NEXT_PUBLIC_USE_INTERNAL_LOGS === 'true') {
  //   await fetch('/api/logs', {
  //     method: 'POST',
  //     body: JSON.stringify({ message, level, data, error, context, userId })
  //   });
  // }
}

/**
 * Convenience functions for specific log levels
 */
export const logger = {
  info: (message: string, data?: Record<string, any>, context?: string) =>
    logEvent({ message, data, context }, 'info'),

  warn: (message: string, data?: Record<string, any>, context?: string) =>
    logEvent({ message, data, context }, 'warn'),

  error: (message: string, error?: Error | unknown, data?: Record<string, any>, context?: string) =>
    logEvent({ message, error, data, context }, 'error'),

  debug: (message: string, data?: Record<string, any>, context?: string) =>
    logEvent({ message, data, context }, 'debug'),
};

/**
 * Set user context for all future logs
 */
export async function setUserContext(userId: string | number, email?: string, username?: string) {
  if (isSentryEnabled()) {
    try {
      const Sentry = await getSentry();
      if (Sentry) {
        Sentry.setUser({ id: String(userId), email, username });
      }
    } catch {
      // Silently fail if Sentry is not available
    }
  }
}

/**
 * Clear user context (e.g., on logout)
 */
export async function clearUserContext() {
  if (isSentryEnabled()) {
    try {
      const Sentry = await getSentry();
      if (Sentry) {
        Sentry.setUser(null);
      }
    } catch {
      // Silently fail if Sentry is not available
    }
  }
}


