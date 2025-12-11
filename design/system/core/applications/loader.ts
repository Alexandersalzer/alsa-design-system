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
  console.log('[APPS LOADER] 🔍 Getting active application routes');
  console.log('[APPS LOADER] Config:', JSON.stringify(config, null, 2));
  
  const activeApps = config.applications.active;
  console.log('[APPS LOADER] Active apps:', activeApps);
  
  const routes: ApplicationRoute[] = [];
  
  for (const app of activeApps) {
    console.log(`[APPS LOADER] Processing app: ${app}`);
    console.log(`[APPS LOADER] App in registry: ${app in APPLICATION_REGISTRY}`);
    
    if (app in APPLICATION_REGISTRY) {
      const appName = app as ApplicationName;
      const appConfig = APPLICATION_REGISTRY[appName];
      
      console.log(`[APPS LOADER] App config for ${appName}:`, appConfig);
      
      for (const route of appConfig.routes) {
        const applicationRoute = {
          path: route,
          app: appName,
          props: appConfig.requiresUserId ? { externalId: config.user.external_id } : {}
        };
        
        console.log(`[APPS LOADER] ✅ Created route:`, applicationRoute);
        routes.push(applicationRoute);
      }
    } else {
      console.warn(`[APPS LOADER] ⚠️  App "${app}" not found in registry`);
    }
  }
  
  console.log(`[APPS LOADER] 📋 Total routes created: ${routes.length}`);
  console.log('[APPS LOADER] Routes:', routes);
  
  return routes;
}

/**
 * Check if a path matches any active application route
 */
export function findApplicationRoute(slug: string, config: Config): ApplicationRoute | null {
  console.log(`[APPS LOADER] 🔍 Finding application route for slug: "${slug}"`);
  
  const routes = getActiveApplicationRoutes(config);
  console.log(`[APPS LOADER] Available routes:`, routes.map(r => r.path));
  
  const found = routes.find(route => route.path === `/${slug}`);
  
  if (found) {
    console.log(`[APPS LOADER] ✅ Found matching route:`, found);
  } else {
    console.log(`[APPS LOADER] ❌ No matching route found for "/${slug}"`);
  }
  
  return found || null;
}