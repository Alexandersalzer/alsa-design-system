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
 * Handles both normal locale routes and toggle mode (.html files)
 */
export function buildBrandHref(
  originalHref: string, 
  currentLocale: SupportedLocale, 
  isToggled: boolean
): string {
  if (isToggled) {
    // Toggle mode: use .html files WITH locale prefix
    const slug = originalHref.replace('/', '') || 'home';
    return `/${currentLocale}/${slug}.html`;
  }
  
  // Normal mode: use locale-based routes
  return `/${currentLocale}${originalHref}`;
}

/**
 * Build href for navigation item
 * Handles both normal locale routes and toggle mode (.html files)
 */
export function buildNavHref(
  item: NavigationItem,
  currentLocale: SupportedLocale,
  isToggled: boolean
): string {
  if (isToggled) {
    // Toggle mode: use slug or href for .html files WITH locale prefix
    const slug = item.slug || item.href.replace('/', '');
    return `/${currentLocale}/${slug}.html`;
  }
  
  // Normal mode: use locale-based routes
  return `/${currentLocale}${item.href}`;
}

/**
 * Check if a navigation item is currently active
 * Compares current pathname with the expected href for the item
 */
export function isNavItemActive(
  item: NavigationItem,
  currentPathname: string,
  currentLocale: SupportedLocale,
  isToggled: boolean
): boolean {
  const expectedHref = buildNavHref(item, currentLocale, isToggled);
  return currentPathname === expectedHref;
}

/**
 * Navigation utilities hook-like object
 * Provides all navigation functions with consistent locale and toggle state
 */
export function createNavigationUtils(currentLocale: SupportedLocale, isToggled: boolean) {
  return {
    buildBrandHref: (originalHref: string) => buildBrandHref(originalHref, currentLocale, isToggled),
    buildNavHref: (item: NavigationItem) => buildNavHref(item, currentLocale, isToggled),
    isNavItemActive: (item: NavigationItem, currentPathname: string) => 
      isNavItemActive(item, currentPathname, currentLocale, isToggled),
    currentLocale,
    isToggled
  };
}

/**
 * Get navigation context from pathname and toggle state
 * Convenience function that combines locale extraction with navigation utils
 */
export function getNavigationContext(pathname: string, isToggled: boolean) {
  const currentLocale = extractLocaleFromPathname(pathname);
  return createNavigationUtils(currentLocale, isToggled);
}