/**
 * Application Registry
 * Central registry for all available applications
 */

export interface ApplicationConfig {
  routes: Record<string, string>; // locale -> path mapping
  requiresUserId: boolean;
}

export const APPLICATION_REGISTRY = {
  bookings: {
    routes: {
      sv: '/boka',
      en: '/booking',
      es: '/reservar',
      de: '/buchen',
      fr: '/reserver'
    },
    requiresUserId: true
  }
} as const;

export type ApplicationName = keyof typeof APPLICATION_REGISTRY;