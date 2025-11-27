
import { SectionNode, PageNode } from '../types/nodes';
import { loadJsonFile, listDirectory } from '../utils/loaders';

/**
 * Generic shell content loader for navbar, footer, etc.
 * Returns typed SectionNode structure
 */
export async function getShellContent(
  shellType: 'navbar' | 'footer', 
  locale: string = 'sv'
): Promise<Record<string, SectionNode> | null> {
  return loadJsonFile<Record<string, SectionNode>>(
    `content/${locale}/${shellType}.json`,
    'sv'
  );
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
  const contentFiles = await listDirectory(`content/${locale}`);
  
  const pageFiles = contentFiles.filter(file => 
    file.endsWith('.json') &&
    !['navbar.json', 'footer.json'].includes(file)
  );
  
  // Search for matching page
  for (const file of pageFiles) {
    const pageData = await loadJsonFile<PageNode>(`content/${locale}/${file}`);
    
    if (pageData) {
      const slug = pageData.name?.toLowerCase().replace(/\s+/g, '-');
      if (slug === pageSlug) {
        return pageData;
      }
    }
  }
  
  // Try fallback locale
  if (locale !== 'sv') {
    return getPageContent('sv', pageSlug);
  }
  
  // Final fallback
  return { 
    name: 'Not Found',
    language: locale,
    sections: {}, 
    order: [],
    props: {} 
  };
}