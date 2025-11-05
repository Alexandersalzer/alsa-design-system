
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
    console.error(`Failed to load globals for locale ${locale}:`, error);
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
    console.error(`Failed to load navbar content for locale ${locale}:`, error);
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
    console.error(`Failed to load footer content for locale ${locale}:`, error);
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      return getFooterContent('sv');
    }
    return null;
  }
}

/**
 * Get the start/home page slug for a specific locale
 * Ultra-lightweight function for redirects - only reads files until it finds the start page
 */
export async function getStartPageSlug(locale: string = 'sv'): Promise<string> {
  if (typeof window !== 'undefined') {
    throw new Error('getStartPageSlug is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const contentDir = path.join(process.cwd(), 'public', 'content', locale);
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    
    // Filter for page files
    const pageFiles = entries.filter(entry => 
      entry.isFile() && 
      entry.name.endsWith('.json') &&
      !['navbar.json', 'footer.json'].includes(entry.name)
    );
    
    // Read files until we find the start page
    for (const file of pageFiles) {
      try {
        const filePath = path.join(contentDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const content = JSON.parse(fileContent);
        
        // Check if this is the start page for this locale
        if (content.type === 'start' && content.language === locale) {
          return content.slug || file.name.replace('.json', '');
        }
      } catch (error) {
        // Continue to next file if this one fails
        continue;
      }
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
 * Ultra-lightweight function for generateStaticParams - only reads filenames
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
    const pageSlugs = entries
      .filter(entry => 
        entry.isFile() && 
        entry.name.endsWith('.json') &&
        !['navbar.json', 'footer.json'].includes(entry.name)
      )
      .map(entry => entry.name.replace('.json', ''));
    
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
    
    const pageFilePath = path.join(
      process.cwd(),
      'public',
      'content',
      locale,
      `${pageSlug}.json`
    );
    
    const fileContent = await fs.readFile(pageFilePath, 'utf8');
    const pageData = JSON.parse(fileContent);
    
    // Return only what PageLayout needs
    return {
      sections: pageData.sections || {},
      order: pageData.order || []
    };
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

/**
 * Load all pages for a specific locale (used for navigation, etc.)
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getAllPagesContent(locale: string = 'sv') {
  if (typeof window !== 'undefined') {
    throw new Error('getAllPagesContent is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const pages = [];
    
    // Load all JSON files from the locale directory
    const contentDir = path.join(process.cwd(), 'public', 'content', locale);
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    
    // Filter for page files (exclude global files like navbar.json, footer.json)
    const pageFiles = entries.filter(entry => 
      entry.isFile() && 
      entry.name.endsWith('.json') &&
      !['navbar.json', 'footer.json'].includes(entry.name)
    );
    
    // Load each page file
    for (const file of pageFiles) {
      try {
        const filePath = path.join(contentDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const content = JSON.parse(fileContent);
        
        // Ensure slug is set
        if (!content.slug) {
          content.slug = file.name.replace('.json', '');
        }
        
        pages.push(content);
      } catch (error) {
        console.error(`Failed to load page file ${file.name}:`, error);
      }
    }

    // Convert pages array to object keyed by slug
    const pagesObject: { [key: string]: any } = {};
    pages.filter(Boolean).forEach(page => {
      if (page.slug) {
        pagesObject[page.slug] = page;
      }
    });

    const result = {
      pages: pagesObject
    };

    return result;
  } catch (error) {
    console.error(`Failed to load all pages for locale ${locale}:`, error);
    // Fallback to Swedish if locale doesn't exist
    if (locale !== 'sv') {
      return getAllPagesContent('sv');
    }
    return null;
  }
} 