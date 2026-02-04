'use client';

import { usePathname } from 'next/navigation';

// Client-side cache for pageId -> slug mapping
// Injected from server via setPageSlugMap
type PageSlugMap = Record<string, Record<string, string>>;
let pageSlugMap: PageSlugMap | null = null;

/**
 * Set the page slug map from server-side data
 * Call this in a layout or provider component
 */
export function setPageSlugMap(map: PageSlugMap): void {
  pageSlugMap = map;
}

/**
 * Get the current page slug map
 */
export function getPageSlugMap(): PageSlugMap | null {
  return pageSlugMap;
}

export function useHref() {
  const pathname = usePathname();

  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1];

  /**
   * Resolve pageId to locale-aware slug
   * Uses the injected page slug map
   */
  const resolvePageId = (pageId: string): string | null => {
    if (!pageSlugMap || !pageSlugMap[pageId]) {
      console.warn(`Page slug map not found for pageId: ${pageId}`);
      return null;
    }
    return pageSlugMap[pageId][currentLocale] || null;
  };

  /**
   * Build a locale-aware href from a given href or pageId
   * 
   * @param href - Original href (for external, anchor, or direct paths)
   * @param pageId - Page ID to resolve to locale-aware slug
   * @returns Href with locale added if needed
   */
  const buildHref = (href?: string, pageId?: string): string => {
    // If pageId is provided, resolve it first
    if (pageId) {
      const resolvedSlug = resolvePageId(pageId);
      if (resolvedSlug) {
        return `/${currentLocale}/${resolvedSlug}`;
      }
      // Fallback: use pageId as slug (remove page_ prefix)
      const fallbackSlug = pageId.replace(/^page_/, '');
      console.warn(`Using fallback slug for pageId: ${pageId} -> ${fallbackSlug}`);
      return `/${currentLocale}/${fallbackSlug}`;
    }

    // Handle href as before
    if (!href || 
        href.startsWith('http') || 
        href.startsWith('mailto:') || 
        href.startsWith('tel:') ||
        href.startsWith('#')) {
      return href || '';
    }

    // Add locale for relative links
    if (href.startsWith('/')) {
      return `/${currentLocale}${href}`;
    }

    // For other types of links, return as-is
    return href;
  };

  return { 
    buildHref,
    resolvePageId,
    currentLocale
  };
}
