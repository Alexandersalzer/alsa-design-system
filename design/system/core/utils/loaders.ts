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

// ===== CONTENT INJECTION =====

/**
 * Content file structure (hybrid format)
 * {
 *   "name": "hem",
 *   "seo": { "title": "...", "description": "..." },
 *   "components": {
 *     "heading_Q2tS8v": { "content": "UGC-content som når fler" },
 *     "body_R5uT1w": { "content": "Alice & Felicia..." }
 *   }
 * }
 */
interface ContentFile {
  name?: string;
  seo?: Record<string, any>;
  components: Record<string, Record<string, any>>;
}

/**
 * Recursively inject content into structure by matching component IDs
 * Traverses the structure and merges content props where IDs match
 */
function injectContentByIds(
  structure: any, 
  contentMap: Record<string, Record<string, any>>
): any {
  if (!structure || typeof structure !== 'object') {
    return structure;
  }

  // Handle arrays
  if (Array.isArray(structure)) {
    return structure.map(item => injectContentByIds(item, contentMap));
  }

  // Clone the object to avoid mutation
  const result = { ...structure };

  // Check each key in the object
  for (const key of Object.keys(result)) {
    const value = result[key];

    // If this key exists in contentMap and value has props, merge content
    if (contentMap[key] && typeof value === 'object' && value !== null) {
      if (value.props !== undefined) {
        // Merge content into props
        result[key] = {
          ...value,
          props: { ...value.props, ...contentMap[key] }
        };
      } else if (value.type !== undefined) {
        // Component without props - add props from content
        result[key] = {
          ...value,
          props: { ...contentMap[key] }
        };
      }
    }

    // Recursively process nested objects
    if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = injectContentByIds(result[key], contentMap);
    }
  }

  return result;
}

// ===== PAGE LOADERS =====

/**
 * Load page structure (design + layout, no content)
 * Path: public/pages/{pageId}.json
 */
export async function getPageStructure(pageId: string): Promise<any | null> {
  return loadJsonFile<any>(`pages/${pageId}.json`);
}

/**
 * Load page content strings for a specific locale
 * Path: public/content/{locale}/pages/{pageId}.json
 */
export async function getPageContentStrings(
  pageId: string, 
  locale: string
): Promise<ContentFile | null> {
  return loadJsonFile<ContentFile>(`content/${locale}/pages/${pageId}.json`);
}

/**
 * Get complete page with merged structure + content
 * Main function for rendering pages
 * 
 * @param pageSlug - URL slug to find the page
 * @param locale - Language code
 * @returns Complete PageNode with content injected
 */
export async function getPageWithContent(
  pageSlug: string, 
  locale: string
): Promise<any> {
  // List all page structure files
  const pageFiles = await listDirectory('pages');
  const jsonFiles = pageFiles.filter(f => f.endsWith('.json'));

  // Find page by matching slug from content file
  for (const file of jsonFiles) {
    const pageId = file.replace('.json', '');
    const content = await getPageContentStrings(pageId, locale);
    
    if (content?.name) {
      const slug = nameToSlug(content.name);
      if (slug === pageSlug) {
        // Found matching page - load structure and merge
        const structure = await getPageStructure(pageId);
        if (!structure) {
          throw new Error(`Page structure not found: ${pageId}`);
        }

        // Inject content into structure
        const merged = injectContentByIds(structure, content.components || {});

        // Add page-level content (name, seo)
        merged.name = content.name;
        merged.locale = locale;
        if (content.seo) {
          merged.seo = { ...merged.seo, ...content.seo };
        }

        return merged;
      }
    }
  }

  throw new Error(`Page not found: ${locale}/${pageSlug}`);
}

/**
 * Get page for rendering (used by blimpify-core).
 * Loads structure from pages/{pageId}.json (sections, props) and merges with content from content/{locale}/pages/{pageId}.json.
 * Signature (locale, slug) for backwards compatibility.
 */
export async function getPageContent(locale: string, pageSlug: string): Promise<any> {
  return getPageWithContent(pageSlug, locale);
}

/**
 * Get page content by page ID (when you already know the ID)
 * Useful for direct page access without slug lookup
 */
export async function getPageById(
  pageId: string, 
  locale: string
): Promise<any> {
  const structure = await getPageStructure(pageId);
  if (!structure) {
    throw new Error(`Page structure not found: ${pageId}`);
  }

  const content = await getPageContentStrings(pageId, locale);
  if (!content) {
    throw new Error(`Page content not found: ${pageId} for locale ${locale}`);
  }

  // Inject content into structure
  const merged = injectContentByIds(structure, content.components || {});

  // Add page-level content
  merged.name = content.name;
  merged.locale = locale;
  if (content.seo) {
    merged.seo = { ...merged.seo, ...content.seo };
  }

  return merged;
}

// ===== SHELL LOADERS =====

/**
 * Load shell structure (design + layout, no content)
 * Path: public/shells/{shellType}.json
 */
export async function getShellStructure(
  shellType: 'navbar' | 'footer'
): Promise<Record<string, any> | null> {
  return loadJsonFile<Record<string, any>>(`shells/${shellType}.json`);
}

/**
 * Load shell content strings for a specific locale
 * Path: public/content/{locale}/shells/{shellType}.json
 */
export async function getShellContentStrings(
  shellType: 'navbar' | 'footer', 
  locale: string
): Promise<ContentFile | null> {
  return loadJsonFile<ContentFile>(`content/${locale}/shells/${shellType}.json`);
}

/**
 * Get complete shell with merged structure + content
 * Main function for rendering navbar/footer
 */
export async function getShellWithContent(
  shellType: 'navbar' | 'footer', 
  locale: string
): Promise<Record<string, any>> {
  const structure = await getShellStructure(shellType);
  if (!structure) {
    console.warn(`Shell structure not found: ${shellType}`);
    return {};
  }

  const content = await getShellContentStrings(shellType, locale);
  if (!content) {
    console.warn(`Shell content not found: ${shellType} for locale ${locale}`);
    return structure; // Return structure without content injection
  }

  // Inject content into structure
  return injectContentByIds(structure, content.components || {});
}

/**
 * Load navbar with content for a specific locale
 * Convenience wrapper around getShellWithContent
 */
export async function getNavbarContent(locale: string): Promise<Record<string, any>> {
  return getShellWithContent('navbar', locale);
}

/**
 * Load footer with content for a specific locale
 * Convenience wrapper around getShellWithContent
 */
export async function getFooterContent(locale: string): Promise<Record<string, any>> {
  return getShellWithContent('footer', locale);
}

// ===== CONFIG LOADERS =====

/**
 * Load config.json from public directory
 */
export async function loadConfig(): Promise<any | null> {
  const config = await loadJsonFile<any>('config/config.json');
  return config;
}

/**
 * Get primary locale from config
 */
export async function getPrimaryLocale(): Promise<string | null> {
  const config = await loadConfig();
  return config?.localization?.iso_code || null;
}