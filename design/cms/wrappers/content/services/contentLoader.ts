
/**
 * Load global content (navbar and footer) for a specific locale
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getGlobalsContent(locale: string = 'sv') {
  if (typeof window !== 'undefined') {
    throw new Error('getGlobalsContent is only available on server-side');
  }

  try {
    const globals: { [key: string]: any } = {};
    
    // Load navbar content
    const navbarContent = await getNavbarContent(locale);
    if (navbarContent) {
      globals.navbar = navbarContent;
    }
    
    // Load footer content
    const footerContent = await getFooterContent(locale);
    if (footerContent) {
      globals.footer = footerContent;
    }
    
    return globals;
  } catch (error) {
    // Fallback to Swedish if locale doesn't exist
    if (locale !== 'sv') {
      return getGlobalsContent('sv');
    }
    return {};
  }
}

/**
 * Load navbar content for a specific locale
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getNavbarContent(locale: string = 'sv') {
  if (typeof window !== 'undefined') {
    throw new Error('getNavbarContent is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const navbarPath = path.join(
      process.cwd(), 
      'public', 
      'content', 
      locale, 
      'navbar.json'
    );
    const fileContent = await fs.readFile(navbarPath, 'utf8');
    const navbarData = JSON.parse(fileContent);
    
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
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getFooterContent(locale: string = 'sv') {
  if (typeof window !== 'undefined') {
    throw new Error('getFooterContent is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const footerPath = path.join(
      process.cwd(), 
      'public', 
      'content', 
      locale, 
      'footer.json'
    );
    const fileContent = await fs.readFile(footerPath, 'utf8');
    const footerData = JSON.parse(fileContent);
    
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
 * Ultra-lightweight function for redirects - reads slug from JSON content
 */
export async function getStartPageSlug(locale: string = 'sv'): Promise<string> {
  if (typeof window !== 'undefined') {
    throw new Error('getStartPageSlug is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const contentDir = path.join(process.cwd(), 'public', 'content', locale);
    
    // First, try to load start.json directly (most common start page)
    try {
      const indexPath = path.join(contentDir, 'start.json');
      const fileContent = await fs.readFile(indexPath, 'utf8');
      const content = JSON.parse(fileContent);
      
      
      // Generate slug from name if no explicit slug exists
      const slug = content.slug || content.name?.toLowerCase().replace(/\s+/g, '-');
      if (slug) {
        console.log(`[DEBUG] getStartPageSlug returning: ${slug}`);
        return slug;
      }
    } catch (error) {
      console.log(`[DEBUG] Failed to read start.json for ${locale}:`, error);
      // start.json doesn't exist, fallback to Swedish or ultimate fallback
    }
    
    // Fallback to Swedish if no start page found and not already Swedish
    if (locale !== 'sv') {
      return getStartPageSlug('sv');
    }
    
    // Ultimate fallback
    return 'home';
  } catch (error) {
    console.error(`Failed to find start page slug for locale ${locale}:`, error);
    return 'home';
  }
}

/**
 * Get all page slugs for a specific locale
 * Ultra-lightweight function for generateStaticParams - reads slug from JSON content
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
    
    // Filter for page files (exclude global files like navbar.json, footer.json)
    const pageFiles = entries.filter(entry => 
      entry.isFile() && 
      entry.name.endsWith('.json') &&
      !['navbar.json', 'footer.json'].includes(entry.name)
    );
    
    
    const pageSlugs: string[] = [];
    
    // Read each file and extract the slug from content
    for (const file of pageFiles) {
      try {
        const filePath = path.join(contentDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const content = JSON.parse(fileContent);
        
        
        // Generate slug from name if no explicit slug exists
        const slug = content.slug || content.name?.toLowerCase().replace(/\s+/g, '-');
        if (slug) {
          pageSlugs.push(slug);
        }
      } catch (error) {
        console.error(`Failed to parse page file ${file.name}:`, error);
        // Continue to next file if this one fails
        continue;
      }
    }
    
    return pageSlugs;
  } catch (error) {
    console.error(`Failed to load page slugs for locale ${locale}:`, error);
    // Fallback to Swedish if locale doesn't exist
    if (locale !== 'sv') {
      return getAllPageSlugs('sv');
    }
    return [];
  }
}

/**
 * Get page props for rendering a specific page
 * Lightweight function that only loads what's needed for PageLayout
 */
export async function getPageContent(locale: string = 'sv', pageSlug: string) {
  if (typeof window !== 'undefined') {
    throw new Error('getPageContent is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const contentDir = path.join(process.cwd(), 'public', 'content', locale);
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    
    // Filter for page files (exclude global files like navbar.json, footer.json)
    const pageFiles = entries.filter(entry => 
      entry.isFile() && 
      entry.name.endsWith('.json') &&
      !['navbar.json', 'footer.json'].includes(entry.name)
    );
    
    // Find the file with matching slug
    for (const file of pageFiles) {
      try {
        const filePath = path.join(contentDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const pageData = JSON.parse(fileContent);
        
        // Generate slug from name if no explicit slug exists  
        const slug = pageData.slug || pageData.name?.toLowerCase().replace(/\s+/g, '-');
        
        // Check if this file's slug matches what we're looking for
        if (slug === pageSlug) {
          return {
            sections: pageData.sections || {},
            order: pageData.order || []
          };
        }
      } catch (error) {
        // Continue to next file if this one fails to parse
        console.error(`Failed to parse page file ${file.name}:`, error);
        continue;
      }
    }
    
    // If no matching file found, throw error
    throw new Error(`No page found with slug "${pageSlug}" in locale "${locale}"`);
    
  } catch (error) {
    console.error(`Failed to load page props for ${pageSlug} in locale ${locale}:`, error);
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      return getPageContent('sv', pageSlug);
    }
    // Return empty state if all fails
    return {
      sections: {},
      order: []
    };
  }
}