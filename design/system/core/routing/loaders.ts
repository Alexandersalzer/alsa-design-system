import { PageNode } from '../types/nodes';
import { loadJsonFile, listDirectory, nameToSlug } from '../utils/loaders';

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