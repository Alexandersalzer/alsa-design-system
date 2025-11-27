import { PageNode } from '../types/nodes';


/**
 * Get the start/home page slug for a specific locale
 * Reads from PageNode structure
 */
export async function getStartPageSlug(locale: string = 'sv'): Promise<string> {
  if (typeof window !== 'undefined') {
    throw new Error('getStartPageSlug is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const startPagePath = path.join(process.cwd(), 'public', 'content', locale, 'start.json');
    const fileContent = await fs.readFile(startPagePath, 'utf8');
    const pageData: PageNode = JSON.parse(fileContent);
    
    // Generate slug from name
    return pageData.name?.toLowerCase().replace(/\s+/g, '-') || 'home';
  } catch (error) {
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      return getStartPageSlug('sv');
    }
    return 'home';
  }
}

/**
 * Get all page slugs for a specific locale
 * Reads from PageNode structures
 */
export async function getAllPageSlugs(locale: string = 'sv'): Promise<string[]> {
  if (typeof window !== 'undefined') {
    throw new Error('getAllPageSlugs is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const contentDir = path.join(process.cwd(), 'public', 'content', locale);
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    
    // Filter for page files (exclude shell files)
    const pageFiles = entries.filter(entry => 
      entry.isFile() && 
      entry.name.endsWith('.json') &&
      !['navbar.json', 'footer.json'].includes(entry.name)
    );
    
    const slugs = await Promise.all(
      pageFiles.map(async (file) => {
        try {
          const filePath = path.join(contentDir, file.name);
          const fileContent = await fs.readFile(filePath, 'utf8');
          const pageData: PageNode = JSON.parse(fileContent);
          
          return pageData.name?.toLowerCase().replace(/\s+/g, '-');
        } catch {
          return null; // Skip invalid files
        }
      })
    );
    
    return slugs.filter((slug): slug is string => slug !== null);
  } catch (error) {
    // Fallback to Swedish if locale doesn't exist
    if (locale !== 'sv') {
      return getAllPageSlugs('sv');
    }
    return [];
  }
}

/**
 * Get available locales by checking which content directories exist
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getAvailableLocales(): Promise<string[]> {
  // Only import fs on server-side
  if (typeof window !== 'undefined') {
    throw new Error('getAvailableLocales is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const contentDir = path.join(process.cwd(), 'public', 'content');
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  } catch (error) {
    console.error('Failed to get available locales:', error);
    return ['sv']; // Default fallback
  }
}