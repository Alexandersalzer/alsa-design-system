import { PageNode } from '../types/nodes';
import { loadJsonFile, listDirectory } from '../utils/loaders';

/**
 * Get the start/home page slug for a specific locale
 * Reads from PageNode structure
 */
export async function getStartPageSlug(locale: string = 'sv'): Promise<string> {
  const pageData = await loadJsonFile<PageNode>(
    `content/${locale}/start.json`,
    'sv'
  );
  
  if (pageData) {
    return pageData.name?.toLowerCase().replace(/\s+/g, '-') || 'home';
  }
  
  return 'home';
}

/**
 * Get all page slugs for a specific locale
 * Reads from PageNode structures
 */
export async function getAllPageSlugs(locale: string = 'sv'): Promise<string[]> {
  const contentFiles = await listDirectory(`content/${locale}`);
  
  const pageFiles = contentFiles.filter(file => 
    file.endsWith('.json') &&
    !['navbar.json', 'footer.json'].includes(file)
  );
  
  const slugs = await Promise.all(
    pageFiles.map(async (file) => {
      const pageData = await loadJsonFile<PageNode>(`content/${locale}/${file}`);
      return pageData?.name?.toLowerCase().replace(/\s+/g, '-') || null;
    })
  );
  
  const validSlugs = slugs.filter((slug): slug is string => slug !== null);
  
  // Fallback to Swedish if no slugs found and not already Swedish
  if (validSlugs.length === 0 && locale !== 'sv') {
    return getAllPageSlugs('sv');
  }
  
  return validSlugs;
}

/**
 * Get available locales by checking which content directories exist
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getAvailableLocales(): Promise<string[]> {
  const entries = await listDirectory('content');
  
  if (entries.length === 0) {
    return ['sv']; // Default fallback
  }
  
  // Filter for directories (locale folders)
  const locales = [];
  for (const entry of entries) {
    // Check if it's a directory by trying to list its contents
    const subEntries = await listDirectory(`content/${entry}`);
    if (subEntries.length > 0) {
      locales.push(entry);
    }
  }
  
  return locales.length > 0 ? locales : ['sv'];
}

/**
 * Extract current locale from pathname for picker display
 * Falls back to first option value if no locale found in path
 */
export const getPickerLocale = (pathname: string, options: { value: string; label: string }[] = []) => {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || options?.[0]?.value || '';
};