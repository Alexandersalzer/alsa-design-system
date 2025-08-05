/**
 * Navigation utilities for handling routes in both normal and toggle modes
 * Used by Navbar and other components that need consistent navigation logic
 */

import { type SupportedLocale } from './locale';

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
 * Handles both normal locale routes and toggle mode (index.html files)
 */
export function buildBrandHref(
  originalHref: string, 
  currentLocale: SupportedLocale, 
  isEditingMode: boolean
): string {
  if (isEditingMode) {
    // Editing mode: use index.html files WITH locale prefix and directory structure
    const slug = originalHref.replace('/', '') || 'home';
    return `/${currentLocale}/${slug}/index.html`;
  }
  
  // Normal mode: use locale-based routes
  return `/${currentLocale}${originalHref}`;
}

/**
 * Build href for navigation item
 * Handles both normal locale routes and toggle mode (index.html files)
 */
export function buildNavHref(
  item: NavigationItem,
  currentLocale: SupportedLocale,
  isEditingMode: boolean
): string {
  console.log('buildNavHref debug:', { item, currentLocale, isEditingMode });
  
  if (isEditingMode) {
    // Editing mode: use slug or href for index.html files WITH locale prefix and directory structure
    const slug = item.slug || item.href.replace('/', '');
    const result = `/${currentLocale}/${slug}/index.html`;
    console.log('buildNavHref editing mode result:', { slug, result });
    return result;
  }
  
  // Normal mode: use locale-based routes
  const result = `/${currentLocale}${item.href}`;
  console.log('buildNavHref normal mode result:', { result });
  return result;
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
 * Navigation utilities hook-like object
 * Provides all navigation functions with consistent locale and toggle state
 */
export function createNavigationUtils(currentLocale: SupportedLocale, isEditingMode: boolean) {
  return {
    buildBrandHref: (originalHref: string) => buildBrandHref(originalHref, currentLocale, isEditingMode),
    buildNavHref: (item: NavigationItem) => buildNavHref(item, currentLocale, isEditingMode),
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