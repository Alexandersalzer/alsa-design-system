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
 * Load content for a specific page and locale
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getPageContent(locale: string = 'sv', pageSlug: string) {
  if (typeof window !== 'undefined') {
    throw new Error('getPageContent is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    // Load page file directly from locale folder (e.g., hem.json, home.json)
    const pageFilePath = path.join(
      process.cwd(),
      'public',
      'content',
      locale,
      `${pageSlug}.json`
    );
    
    const fileContent = await fs.readFile(pageFilePath, 'utf8');
    const pageData = JSON.parse(fileContent);
    
    // Ensure slug is set
    if (!pageData.slug) {
      pageData.slug = pageSlug;
    }
    
    console.log(`✅ Loaded content for page: ${pageSlug}`);
    return pageData;
  } catch (error) {
    console.error(`Failed to load content for page ${pageSlug} in locale ${locale}:`, error);
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      return getPageContent('sv', pageSlug);
    }
    return null;
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
    
    // Load all JSON files in the locale folder
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
      const pageSlug = file.name.replace('.json', '');
      try {
        const filePath = path.join(contentDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const content = JSON.parse(fileContent);
        
        // Ensure slug is set
        if (!content.slug) {
          content.slug = pageSlug;
        }
        
        pages.push(content);
        console.log(`✅ Loaded page: ${file.name}`);
      } catch (error) {
        console.error(`Failed to load page file ${file.name}:`, error);
      }
    }

    // Load all global components
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
    
    // Convert pages array to object keyed by slug for WebsiteContent format
    const pagesObject: { [key: string]: any } = {};
    pages.filter(Boolean).forEach(page => {
      if (page.slug) {
        pagesObject[page.slug] = page;
      }
    });

    // Return in WebsiteContent format
    return {
      pages: pagesObject,
      globals: Object.keys(globals).length > 0 ? globals : undefined
    };
  } catch (error) {
    console.error(`Failed to load all pages for locale ${locale}:`, error);
    // Fallback to Swedish if locale doesn't exist
    if (locale !== 'sv') {
      return getAllPagesContent('sv');
    }
    return null;
  }
} 