/**
 * Application Registry
 * Central registry for all available applications
 */

export interface ApplicationConfig {
  routes: string[];
  requiresUserId: boolean;
}

export const APPLICATION_REGISTRY = {
  bookings: {
    routes: ['/booking'],
    requiresUserId: true
  }
} as const;

export type ApplicationName = keyof typeof APPLICATION_REGISTRY;