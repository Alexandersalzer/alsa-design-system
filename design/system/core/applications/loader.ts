/**
 * Application Loader
 * Functions for loading and managing dynamic applications
 */

import { APPLICATION_REGISTRY, type ApplicationName } from './registry';
import type { Config } from './types';

export interface ApplicationRoute {
  path: string;
  app: ApplicationName;
  props: Record<string, any>;
}

/**
 * Get active application routes based on config
 */
export function getActiveApplicationRoutes(config: Config): ApplicationRoute[] {
  const activeApps = config.applications.active;
  const locale = config.localization.iso_code;
  const routes: ApplicationRoute[] = [];
  
  for (const app of activeApps) {
    if (app in APPLICATION_REGISTRY) {
      const appName = app as ApplicationName;
      const appConfig = APPLICATION_REGISTRY[appName];
      
      // Get locale-specific route or fallback to 'en' or app name
      const localeRoute = appConfig.routes[locale as keyof typeof appConfig.routes];
      const fallbackRoute = appConfig.routes['en' as keyof typeof appConfig.routes];
      const route = localeRoute || fallbackRoute || `/${app}`;
      
      routes.push({
        path: route,
        app: appName,
        props: appConfig.requiresUserId ? { externalId: config.user.external_id } : {}
      });
    }
  }
  
  return routes;
}

/**
 * Check if a path matches any active application route
 */
export function findApplicationRoute(slug: string, config: Config): ApplicationRoute | null {
  const routes = getActiveApplicationRoutes(config);
  return routes.find(route => route.path === `/${slug}`) || null;
}