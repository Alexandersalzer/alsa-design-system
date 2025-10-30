interface LayoutItem {
  template: string;
  [key: string]: unknown;
}

/**
 * Load a global template/component file
 * Uses dynamic import to avoid bundling fs in browser
 */
async function getTemplateContent(locale: string, templateName: string) {
  if (typeof window !== 'undefined') {
    throw new Error('getTemplateContent is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const templatePath = path.join(
      process.cwd(), 
      'public', 
      'content', 
      locale, 
      'templates', 
      `${templateName}.json`
    );
    const fileContent = await fs.readFile(templatePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load global template ${templateName} in locale ${locale}:`, error);
    return null;
  }
}

/**
 * Load layout configuration for a specific page
 * Uses dynamic import to avoid bundling fs in browser
 */
async function loadPageLayout(locale: string, pageSlug: string) {
  if (typeof window !== 'undefined') {
    throw new Error('loadPageLayout is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const layoutPath = path.join(
      process.cwd(), 
      'public', 
      'content', 
      locale, 
      'pages', 
      pageSlug, 
      'layout.json'
    );
    const fileContent = await fs.readFile(layoutPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to load layout for page ${pageSlug} in locale ${locale}:`, error);
    return [];
  }
}

/**
 * Load content for a specific page and locale using the separated structure
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getPageContent(locale: string = 'sv', pageSlug: string) {
  if (typeof window !== 'undefined') {
    throw new Error('getPageContent is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    // Load page.json (metadata only)
    const pagePath = path.join(
      process.cwd(), 
      'public', 
      'content', 
      locale, 
      'pages', 
      pageSlug, 
      'page.json'
    );
    
    const pageContent = await fs.readFile(pagePath, 'utf8');
    const pageData = JSON.parse(pageContent);
    
    // Load layout.json separately
    const layoutData = await loadPageLayout(locale, pageSlug);
    
    // Load all templates referenced in the layout
    if (layoutData && Array.isArray(layoutData)) {
      const templates = await Promise.all(
        layoutData.map(async (layoutItem: LayoutItem) => {
          // Always load from global templates directory
          const template = await getTemplateContent(locale, layoutItem.template);
          return template; // Return natural structure without modifications
        })
      );
      
      // Return combined data with templates
      const result = {
        ...pageData,
        slug: pageSlug, // Ensure slug is set
        templates: templates.filter(t => t !== null)
      };
      
      return result;
    }
    
    const result = {
      ...pageData,
      slug: pageSlug, // Ensure slug is set
      templates: []
    };
    
    return result;
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
    
    // Load from new pages structure
    const pagesDir = path.join(process.cwd(), 'public', 'content', locale, 'pages');
    const pageEntries = await fs.readdir(pagesDir, { withFileTypes: true });
    
    for (const entry of pageEntries) {
      if (entry.isDirectory()) {
        const pageSlug = entry.name;
        const content = await getPageContent(locale, pageSlug);
        if (content) {
          pages.push(content);
        }
      }
    }
    
    // Also check for any remaining direct JSON files (like about.json) for backward compatibility
    const contentDir = path.join(process.cwd(), 'public', 'content', locale);
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    const directFiles = entries.filter(entry => entry.isFile() && entry.name.endsWith('.json'));
    
    for (const file of directFiles) {
      const pageSlug = file.name.replace('.json', '');
      try {
        const filePath = path.join(contentDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const content = JSON.parse(fileContent);
        pages.push(content);
      } catch (error) {
        console.error(`Failed to load direct file ${file.name}:`, error);
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

    const result = {
      pages: pagesObject,
      globals: Object.keys(globals).length > 0 ? globals : undefined
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