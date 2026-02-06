import { PageNode } from '../types/nodes';
import { loadJsonFile, listDirectory, nameToSlug } from '../utils/loaders';

// ===== PAGE SLUG MAP =====
// Cache for pageId -> slug mapping per locale
// Built at startup and used for navigation resolution
type PageSlugMap = Record<string, Record<string, string>>; // { pageId: { locale: slug } }
let pageSlugMapCache: PageSlugMap | null = null;

/**
 * Build a complete mapping of pageId -> slug for all locales
 * Used for resolving pageId references in navigation actions
 */
export async function buildPageSlugMap(): Promise<PageSlugMap> {
  if (pageSlugMapCache) {
    return pageSlugMapCache;
  }

  const map: PageSlugMap = {};
  const locales = await getAvailableLocales();

  for (const locale of locales) {
    const contentFiles = await listDirectory(`content/${locale}/pages`);
    const pageFiles = contentFiles.filter(file => 
      file.endsWith('.json') &&
      !['navbar.json', 'footer.json'].includes(file)
    );

    for (const file of pageFiles) {
      const pageId = file.replace('.json', '');
      const pageData = await loadJsonFile<PageNode>(`content/${locale}/pages/${file}`);
      
      if (pageData?.name) {
        if (!map[pageId]) {
          map[pageId] = {};
        }
        map[pageId][locale] = nameToSlug(pageData.name);
      }
    }
  }

  pageSlugMapCache = map;
  return map;
}

/**
 * Get slug for a specific pageId and locale
 * @param pageId - The page identifier (e.g., "page_mjU8bl" or "start")
 * @param locale - The locale code (e.g., "sv", "en")
 * @returns The localized slug or null if not found
 */
export async function getSlugByPageId(pageId: string, locale: string): Promise<string | null> {
  const map = await buildPageSlugMap();
  return map[pageId]?.[locale] || null;
}

/**
 * Get the complete page slug map (for client-side injection)
 */
export async function getPageSlugMap(): Promise<PageSlugMap> {
  return buildPageSlugMap();
}

/**
 * Clear the page slug map cache (useful for development/hot reload)
 */
export function clearPageSlugMapCache(): void {
  pageSlugMapCache = null;
}

/**
 * Get the start/home page slug for a specific locale
 * Reads from PageNode structure
 */
export async function getStartPageSlug(locale: string): Promise<string | null> {
  const pageData = await loadJsonFile<PageNode>(`content/${locale}/pages/start.json`);
  
  if (pageData?.name) {
    return nameToSlug(pageData.name);
  }
  
  return null;
}

/**
 * Get all page slugs for a specific locale, extraherar name från page sidor och konverterar till slug
 * Reads from PageNode structures
 */
export async function getAllPageSlugs(locale: string): Promise<string[]> {
  const contentFiles = await listDirectory(`content/${locale}/pages`);
  
   // Excluding navbar and footer files
  const pageFiles = contentFiles.filter(file => 
    file.endsWith('.json') &&
    !['navbar.json', 'footer.json'].includes(file)
  );
  
  const slugs = await Promise.all(
    pageFiles.map(async (file) => {
      const pageData = await loadJsonFile<PageNode>(`content/${locale}/pages/${file}`);
      return pageData?.name ? nameToSlug(pageData.name) : null;
    })
  );
  
  return slugs.filter((slug): slug is string => slug !== null);
}

/**
 * Get available locales by checking which content directories exist
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getAvailableLocales(): Promise<string[]> {
  const entries = await listDirectory('content');
  const locales = [];
  
  for (const entry of entries) {
    // Check if it's a directory by trying to list its contents
    const subEntries = await listDirectory(`content/${entry}`);
    if (subEntries.length > 0) {
      locales.push(entry);
    }
  }
  
  return locales;
}

/**
 * Extract current locale from pathname for picker display
 * Falls back to first option value if no locale found in path
 */
export const getPickerLocale = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || null;
};