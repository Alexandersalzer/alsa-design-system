
import { SectionNode, PageNode } from '../types/nodes';
import { loadJsonFile, listDirectory } from '../utils/loaders';
import { nameToSlug } from '../utils/loaders';

/**
 * Generic shell content loader for navbar, footer, etc.
 * Returns typed SectionNode structure
 */
export async function getShellContent(
  shellType: 'navbar' | 'footer', 
  locale: string
): Promise<Record<string, SectionNode> | null> {
  return loadJsonFile<Record<string, SectionNode>>(
    `content/${locale}/${shellType}.json`
  );
}

/**
 * Load navbar content for a specific locale
 * Convenience wrapper around getShellContent
 */
export async function getNavbarContent(locale: string): Promise<Record<string, SectionNode> | null> {
  return getShellContent('navbar', locale);
}

/**
 * Load footer content for a specific locale  
 * Convenience wrapper around getShellContent
 */
export async function getFooterContent(locale: string): Promise<Record<string, SectionNode> | null> {
  return getShellContent('footer', locale);
}


/**
 * Get page content for rendering a specific page
 * Returns complete PageNode structure
 */
export async function getPageContent(locale: string, pageSlug: string): Promise<PageNode | null> {
  const contentFiles = await listDirectory(`content/${locale}`);
  
  // Excluding navbar and footer files
  const pageFiles = contentFiles.filter(file => 
    file.endsWith('.json') &&
    !['navbar.json', 'footer.json'].includes(file)
  );
  
  // Search for matching page
  for (const file of pageFiles) {
    const pageData = await loadJsonFile<PageNode>(`content/${locale}/${file}`);
    
    if (pageData?.name) {
      const slug = nameToSlug(pageData.name);
      if (slug === pageSlug) {
        return pageData;
      }
    }
  }
  
  throw new Error(`Page not found: ${locale}/${pageSlug}`);
}