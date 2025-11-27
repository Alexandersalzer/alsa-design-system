
import { SectionNode, PageNode } from '../types/nodes';

/**
 * Generic shell content loader for navbar, footer, etc.
 * Returns typed SectionNode structure
 */
export async function getShellContent(
  shellType: 'navbar' | 'footer', 
  locale: string = 'sv'
): Promise<Record<string, SectionNode> | null> {
  if (typeof window !== 'undefined') {
    throw new Error('getShellContent is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const shellPath = path.join(process.cwd(), 'public', 'content', locale, `${shellType}.json`);
    const fileContent = await fs.readFile(shellPath, 'utf8');
    const shellData: Record<string, SectionNode> = JSON.parse(fileContent);
    
    return shellData;
  } catch (error) {
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      return getShellContent(shellType, 'sv');
    }
    return null;
  }
}

/**
 * Load navbar content for a specific locale
 * Convenience wrapper around getShellContent
 */
export async function getNavbarContent(locale: string = 'sv'): Promise<Record<string, SectionNode> | null> {
  return getShellContent('navbar', locale);
}

/**
 * Load footer content for a specific locale  
 * Convenience wrapper around getShellContent
 */
export async function getFooterContent(locale: string = 'sv'): Promise<Record<string, SectionNode> | null> {
  return getShellContent('footer', locale);
}


/**
 * Get page content for rendering a specific page
 * Returns complete PageNode structure
 */
export async function getPageContent(locale: string = 'sv', pageSlug: string): Promise<PageNode> {
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
          return pageData;
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
    
    return { 
      name: 'Not Found',
      language: locale,
      sections: {}, 
      order: [],
      props: {} 
    };
  }
}