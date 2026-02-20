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
    // Try to get pageSlugMap from iframe global object (editor environment)
    // This is injected by WebsiteRenderer in editor
    const iframeSlugMap = typeof window !== 'undefined' 
      ? (window as any).__BLIMPIFY_PAGE_SLUG_MAP__ 
      : null;
    
    // Use iframe slug map if available, otherwise fall back to module-level pageSlugMap
    const slugMap = iframeSlugMap || pageSlugMap;
    
    if (!slugMap || !slugMap[pageId]) {
      console.warn(`Page slug map not found for pageId: ${pageId}`);
      return null;
    }
    return slugMap[pageId][currentLocale] || null;
  };

  /**
   * Build a locale-aware href from a given href, pageId, and optional anchor
   * 
   * @param href - Original href (for external, anchor, or direct paths)
   * @param pageId - Page ID to resolve to locale-aware slug
   * @param anchor - Optional anchor/hash to append (without #)
   * @returns Href with locale added if needed
   */
  const buildHref = (href?: string, pageId?: string, anchor?: string): string => {
    let finalHref = '';

    // If pageId is provided, resolve it first
    if (pageId) {
      const resolvedSlug = resolvePageId(pageId);
      if (resolvedSlug) {
        finalHref = `/${currentLocale}/${resolvedSlug}`;
      } else {
        // Fallback: use pageId as slug (remove page_ prefix)
        const fallbackSlug = pageId.replace(/^page_/, '');
        console.warn(`Using fallback slug for pageId: ${pageId} -> ${fallbackSlug}`);
        finalHref = `/${currentLocale}/${fallbackSlug}`;
      }
    } else if (href) {
      // Handle href as before
      if (href.startsWith('http') || 
          href.startsWith('mailto:') || 
          href.startsWith('tel:') ||
          href.startsWith('#')) {
        finalHref = href;
      } else if (href.startsWith('/')) {
        // Add locale for relative links
        finalHref = `/${currentLocale}${href}`;
      } else {
        finalHref = href;
      }
    }

    // Append anchor if provided (and not already a hash link)
    if (anchor && !finalHref.startsWith('#')) {
      const cleanAnchor = anchor.startsWith('#') ? anchor.slice(1) : anchor;
      finalHref = `${finalHref}#${cleanAnchor}`;
    }

    return finalHref;
  };

  return { 
    buildHref,
    resolvePageId,
    currentLocale
  };
}
