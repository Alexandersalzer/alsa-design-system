/**
 * Generic JSON file loader for server-side operations.
 * Reads and parses JSON files from the public directory with type safety.
 * Returns null if file doesn't exist or parsing fails - no fallbacks provided.
 */
export async function loadJsonFile<T>(filePath: string): Promise<T | null> {
  if (typeof window !== 'undefined') {
    throw new Error('loadJsonFile is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const fullPath = path.join(process.cwd(), 'public', filePath);
    const fileContent = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(fileContent) as T;
    
  } catch (error) {
    return null;
  }
}

/**
 * List directory contents on server-side
 * Returns array of file and directory names. 
 * Exempel 1 listDirectory("content") → ["sv", "en", "de"]
 * Exempel 2 listDirectory("content/sv") → ["navbar.json", "footer.json", "start.json"]
 */
export async function listDirectory(dirPath: string): Promise<string[]> {
  if (typeof window !== 'undefined') {
    throw new Error('listDirectory is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const fullPath = path.join(process.cwd(), 'public', dirPath);
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    
    return entries
      .filter(entry => entry.isFile() || entry.isDirectory())
      .map(entry => entry.name);
  } catch (error) {
    return [];
  }
}

/**
 * Convert page prop value name to URL-safe slug
 * Centralized logic used by multiple functions
 * Handles Swedish characters (å, ä, ö) and other special characters
 */
export const nameToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/å/g, 'a')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
};

// ===== CONTENT LOADERS =====

/**
 * Generic shell content loader for navbar, footer, etc.
 * Returns typed SectionNode structure
 */
export async function getShellContent(
  shellType: 'navbar' | 'footer', 
  locale: string
): Promise<Record<string, any>> {
  const content = await loadJsonFile<Record<string, any>>(
    `content/${locale}/${shellType}.json`
  );
  return content || {};
}

/**
 * Load navbar content for a specific locale
 * Convenience wrapper around getShellContent
 */
export async function getNavbarContent(locale: string): Promise<Record<string, any> | null> {
  return getShellContent('navbar', locale);
}

/**
 * Load footer content for a specific locale  
 * Convenience wrapper around getShellContent
 */
export async function getFooterContent(locale: string): Promise<Record<string, any> | null> {
  return getShellContent('footer', locale);
}

/**
 * Get page content for rendering a specific page
 * Returns complete PageNode structure
 */
export async function getPageContent(locale: string, pageSlug: string): Promise<any> {
  const contentFiles = await listDirectory(`content/${locale}`);
  
  // Excluding navbar and footer files
  const pageFiles = contentFiles.filter(file => 
    file.endsWith('.json') &&
    !['navbar.json', 'footer.json'].includes(file)
  );
  
  // Search for matching page
  for (const file of pageFiles) {
    const pageData = await loadJsonFile<any>(`content/${locale}/${file}`);
    
    if (pageData?.name) {
      const slug = nameToSlug(pageData.name);
      if (slug === pageSlug) {
        return pageData;
      }
    }
  }
  throw new Error(`Page not found: ${locale}/${pageSlug}`);
}