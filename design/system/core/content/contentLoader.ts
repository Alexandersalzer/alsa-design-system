
import { SectionNode, PageNode } from '../types/nodes';

/**
 * Shell content structure
 */
interface ShellContent {
  navbar?: Record<string, SectionNode>;
  footer?: Record<string, SectionNode>;
}

/**
 * Load shell content (navbar and footer) for a specific locale
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getShellContent(locale: string = 'sv'): Promise<ShellContent> {
  if (typeof window !== 'undefined') {
    throw new Error('getShellContent is only available on server-side');
  }

  try {
    const [navbarContent, footerContent] = await Promise.all([
      getNavbarContent(locale),
      getFooterContent(locale)
    ]);
    
    return {
      navbar: navbarContent || undefined,
      footer: footerContent || undefined
    };
  } catch (error) {
    // Fallback to Swedish if locale doesn't exist
    if (locale !== 'sv') {
      return getShellContent('sv');
    }
    return {};
  }
}

/**
 * Load navbar content for a specific locale
 * Returns typed SectionNode structure
 */
export async function getNavbarContent(locale: string = 'sv'): Promise<Record<string, SectionNode> | null> {
  if (typeof window !== 'undefined') {
    throw new Error('getNavbarContent is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const navbarPath = path.join(process.cwd(), 'public', 'content', locale, 'navbar.json');
    const fileContent = await fs.readFile(navbarPath, 'utf8');
    const navbarData: Record<string, SectionNode> = JSON.parse(fileContent);
    
    return navbarData;
  } catch (error) {
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      return getNavbarContent('sv');
    }
    return null;
  }
}

/**
 * Load footer content for a specific locale
 * Returns typed SectionNode structure
 */
export async function getFooterContent(locale: string = 'sv'): Promise<Record<string, SectionNode> | null> {
  if (typeof window !== 'undefined') {
    throw new Error('getFooterContent is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const footerPath = path.join(process.cwd(), 'public', 'content', locale, 'footer.json');
    const fileContent = await fs.readFile(footerPath, 'utf8');
    const footerData: Record<string, SectionNode> = JSON.parse(fileContent);
    
    return footerData;
  } catch (error) {
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      return getFooterContent('sv');
    }
    return null;
  }
}

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
 * Page content structure for rendering
 */
interface PageContent {
  sections: Record<string, SectionNode>;
  order: string[];
}

/**
 * Get page content for rendering a specific page
 * Returns typed PageNode structure optimized for rendering
 */
export async function getPageContent(locale: string = 'sv', pageSlug: string): Promise<PageContent> {
  if (typeof window !== 'undefined') {
    throw new Error('getPageContent is only available on server-side');
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
    
    // Search for matching page
    for (const file of pageFiles) {
      try {
        const filePath = path.join(contentDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const pageData: PageNode = JSON.parse(fileContent);
        
        const slug = pageData.name?.toLowerCase().replace(/\s+/g, '-');
        
        if (slug === pageSlug) {
          return {
            sections: pageData.sections,
            order: pageData.order
          };
        }
      } catch {
        continue; // Skip invalid files
      }
    }
    
    throw new Error(`No page found with slug "${pageSlug}" in locale "${locale}"`);
    
  } catch (error) {
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      return getPageContent('sv', pageSlug);
    }
    
    return { sections: {}, order: [] };
  }
}