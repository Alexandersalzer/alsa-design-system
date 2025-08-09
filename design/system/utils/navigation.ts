/**
 * Navigation utilities for handling routes in both normal and toggle modes
 * Used by Navbar and other components that need consistent navigation logic
 */

import { type SupportedLocale } from './locale';
import { 
  sendNavigationUpdateToParent,
  createNavigationMessageHandlers,
  useNavigationMessageListener,
  type NavigationMessageHandlers
} from '../../cms/messaging/navigation/child';

export interface NavigationItem {
  href: string;
  slug?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Extract current locale from pathname
 * Works with Next.js [locale] dynamic routes
 */
export function extractLocaleFromPathname(pathname: string): SupportedLocale {
  const segments = pathname.split('/').filter(Boolean);
  const potentialLocale = segments[0];
  
  if (potentialLocale === 'sv' || potentialLocale === 'en') {
    return potentialLocale;
  }
  
  return 'sv'; // Default fallback
}

/**
 * Build href for brand/home link
 * Handles both normal locale routes and toggle mode (/index.html files)
 */
export function buildBrandHref(
  originalHref: string, 
  currentLocale: SupportedLocale, 
  isEditingMode: boolean
): string {
  if (isEditingMode) {
    // Toggle mode: use /index.html files WITH locale prefix
    const slug = originalHref.replace('/', '') || 'home';
    return `/${currentLocale}/${slug}/index.html`;
  }
  
  // Normal mode: use locale-based routes
  return `/${currentLocale}${originalHref}`;
}

/**
 * Build href for navigation item
 * Handles both normal locale routes and toggle mode (/index.html files)
 */
export function buildNavHref(
  item: NavigationItem,
  currentLocale: SupportedLocale,
  isEditingMode: boolean
): string {
  if (isEditingMode) {
    // Toggle mode: use slug or href for /index.html files WITH locale prefix
    const slug = item.slug || item.href.replace('/', '');
    return `/${currentLocale}/${slug}/index.html`;
  }
  
  // Normal mode: use locale-based routes
  return `/${currentLocale}${item.href}`;
}

/**
 * Build postMessage href for editing mode communication
 * Uses same format as page picker: /${locale}/${slug}
 */
export function buildPostMessageHref(
  item: NavigationItem,
  currentLocale: SupportedLocale
): string {
  const slug = item.slug || item.href.replace('/', '');
  return `/${currentLocale}/${slug}`;
}

/**
 * Check if a navigation item is currently active
 * Compares current pathname with the expected href for the item
 */
export function isNavItemActive(
  item: NavigationItem,
  currentPathname: string,
  currentLocale: SupportedLocale,
  isEditingMode: boolean
): boolean {
  const expectedHref = buildNavHref(item, currentLocale, isEditingMode);
  return currentPathname === expectedHref;
}

/**
 * Handle navigation click with postMessage support
 * Sends navigation update to parent in editing mode using correct format
 */
export function handleNavigationClick(
  href: string,
  slug: string | undefined,
  item: NavigationItem | undefined,
  currentLocale: SupportedLocale,
  isEditingMode: boolean,
  logPrefix: string = '🧭'
) {
  console.log(`${logPrefix} Navigation clicked:`, { href, slug, isEditingMode });
  
  // If in editing mode, notify parent about navigation using page picker format
  if (isEditingMode && item) {
    const postMessageHref = buildPostMessageHref(item, currentLocale);
    const postMessageSlug = item.slug || item.href.replace('/', '');
    
    console.log(`${logPrefix} Sending navigation update to parent:`, { 
      href: postMessageHref, 
      slug: postMessageSlug,
      locale: currentLocale
    });
    
    sendNavigationUpdateToParent(postMessageHref, postMessageSlug);
  }
}

/**
 * Create navigation message handlers for parent-to-child communication
 * Provides a standardized way to handle navigation updates from parent
 */
export function createNavigationMessageHandlersWithRouter(
  router: { push: (href: string) => void },
  pathname: string,
  isEditingMode: boolean,
  logPrefix: string = '🧭'
): NavigationMessageHandlers {
  return createNavigationMessageHandlers({
    onNavigationChange: (href: string) => {
      console.log(`${logPrefix} Received navigation update from parent:`, href);
      
      // Navigate to the new href if different from current pathname
      if (href !== pathname) {
        router.push(href);
      }
    },
    isEditingMode
  });
}

/**
 * Setup navigation message listener for components
 * Convenience function that only sets up listener in editing mode
 */
export function useNavigationMessaging(
  router: { push: (href: string) => void },
  pathname: string,
  isEditingMode: boolean,
  logPrefix: string = '🧭'
) {
  const navigationHandlers = createNavigationMessageHandlersWithRouter(
    router,
    pathname,
    isEditingMode,
    logPrefix
  );

  // Listen for navigation messages from parent (only in editing mode)
  if (isEditingMode) {
    useNavigationMessageListener(navigationHandlers);
  }

  return {
    handleNavigationClick: (href: string, slug?: string, item?: NavigationItem) => {
      const currentLocale = extractLocaleFromPathname(pathname);
      handleNavigationClick(href, slug, item, currentLocale, isEditingMode, logPrefix);
    }
  };
}

/**
 * Navigation utilities hook-like object
 * Provides all navigation functions with consistent locale and toggle state
 */
export function createNavigationUtils(currentLocale: SupportedLocale, isEditingMode: boolean) {
  return {
    buildBrandHref: (originalHref: string) => buildBrandHref(originalHref, currentLocale, isEditingMode),
    buildNavHref: (item: NavigationItem) => buildNavHref(item, currentLocale, isEditingMode),
    buildPostMessageHref: (item: NavigationItem) => buildPostMessageHref(item, currentLocale),
    isNavItemActive: (item: NavigationItem, currentPathname: string) => 
      isNavItemActive(item, currentPathname, currentLocale, isEditingMode),
    currentLocale,
    isEditingMode
  };
}

/**
 * Get navigation context from pathname and toggle state
 * Convenience function that combines locale extraction with navigation utils
 */
export function getNavigationContext(pathname: string, isEditingMode: boolean) {
  const currentLocale = extractLocaleFromPathname(pathname);
  return createNavigationUtils(currentLocale, isEditingMode);
}