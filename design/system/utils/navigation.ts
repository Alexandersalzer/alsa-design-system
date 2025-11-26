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
 * Extract locale from CMS content metadata (for editing mode)
 * Fallback to pathname extraction if no CMS data available
 */
export function extractLocaleFromCMS(
  cmsContent: any, 
  fallbackPathname?: string
): SupportedLocale {
  // First try to get locale from CMS content meta data
  if (cmsContent?.meta?.locale) {
    const cmsLocale = cmsContent.meta.locale;
    if (cmsLocale === 'sv' || cmsLocale === 'en') {
      console.log('🌐 Using locale from CMS content:', cmsLocale);
      return cmsLocale;
    }
  }
  
  // Fallback to pathname extraction
  if (fallbackPathname) {
    return extractLocaleFromPathname(fallbackPathname);
  }
  
  console.log('🌐 Using default locale fallback: sv');
  return 'sv';
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
 * Enhanced to better handle slug from CMS data
 */
export function buildNavHref(
  item: NavigationItem,
  currentLocale: SupportedLocale,
  isEditingMode: boolean
): string {
  if (isEditingMode) {
    // Toggle mode: use slug or href for /index.html files WITH locale prefix
    let slug = '';
    
    // Priority: 1) item.slug, 2) extract from item.href, 3) fallback
    if (item.slug && item.slug.trim()) {
      slug = item.slug.trim();
    } else if (item.href) {
      slug = item.href.replace('/', '').trim() || 'home';
    } else {
      slug = 'home';
    }
    
    console.log('🧭 Building nav href for editing mode:', {
      itemSlug: item.slug,
      itemHref: item.href,
      extractedSlug: slug,
      currentLocale,
      finalHref: `/${currentLocale}/${slug}/index.html`
    });
    
    return `/${currentLocale}/${slug}/index.html`;
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
  isEditingMode: boolean
): boolean {
  const expectedHref = buildNavHref(item, currentLocale, isEditingMode);
  return currentPathname === expectedHref;
}

/**
 * Navigation utilities hook-like object
 * Provides all navigation functions with consistent locale and toggle state
 * Enhanced to work with CMS content for locale detection
 */
export function createNavigationUtils(
  currentLocale: SupportedLocale, 
  isEditingMode: boolean,
  cmsContent?: any
) {
  // Use CMS locale if available and in editing mode
  const effectiveLocale = isEditingMode && cmsContent?.meta?.locale 
    ? (cmsContent.meta.locale as SupportedLocale)
    : currentLocale;

  return {
    buildBrandHref: (originalHref: string) => buildBrandHref(originalHref, effectiveLocale, isEditingMode),
    buildNavHref: (item: NavigationItem) => buildNavHref(item, effectiveLocale, isEditingMode),
    isNavItemActive: (item: NavigationItem, currentPathname: string) => 
      isNavItemActive(item, currentPathname, effectiveLocale, isEditingMode),
    currentLocale: effectiveLocale,
    isEditingMode
  };
}

/**
 * Get navigation context from pathname and toggle state
 * Convenience function that combines locale extraction with navigation utils
 * Enhanced to work with CMS content
 */
export function getNavigationContext(
  pathname: string, 
  isEditingMode: boolean,
  cmsContent?: any
) {
  const currentLocale = isEditingMode 
    ? extractLocaleFromCMS(cmsContent, pathname)
    : extractLocaleFromPathname(pathname);
    
  return createNavigationUtils(currentLocale, isEditingMode, cmsContent);
}