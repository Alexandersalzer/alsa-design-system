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
 * Load global template content for a specific locale and component type
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getGlobalComponentContent(locale: string = 'sv', componentType: string) {
  if (typeof window !== 'undefined') {
    throw new Error('getGlobalComponentContent is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const globalPath = path.join(
      process.cwd(), 
      'public', 
      'content', 
      locale, 
      'globals',
      componentType,
      `${componentType}.json`
    );
    const fileContent = await fs.readFile(globalPath, 'utf8');
    const globalData = JSON.parse(fileContent);
    
    // Return the natural JSON structure without artificial fields
    return globalData;
  } catch (error) {
    console.error(`Failed to load ${componentType} content for locale ${locale}:`, error);
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      return getGlobalComponentContent('sv', componentType);
    }
    return null;
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
      return {
        ...pageData,
        slug: pageSlug, // Ensure slug is set
        templates: templates.filter(t => t !== null)
      };
    }
    
    return {
      ...pageData,
      slug: pageSlug, // Ensure slug is set
      templates: []
    };
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
    
    // Load from new pages structure
    const pagesDir = path.join(process.cwd(), 'public', 'content', locale, 'pages');
    const pageEntries = await fs.readdir(pagesDir, { withFileTypes: true });
    
    for (const entry of pageEntries) {
      if (entry.isDirectory()) {
        const pageSlug = entry.name;
        const content = await getPageContent(locale, pageSlug);
        if (content) pages.push(content);
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
    
    try {
      const globalsDir = path.join(process.cwd(), 'public', 'content', locale, 'globals');
      const globalEntries = await fs.readdir(globalsDir, { withFileTypes: true });
      
      for (const entry of globalEntries) {
        if (entry.isDirectory()) {
          const componentType = entry.name;
          const globalContent = await getGlobalComponentContent(locale, componentType);
          if (globalContent) {
            globals[componentType] = globalContent;
          }
        }
      }
    } catch (error) {
      console.error(`Failed to load globals directory for locale ${locale}:`, error);
      // Fallback to just navbar for backward compatibility
      const navbarContent = await getGlobalComponentContent(locale, 'navbar');
      if (navbarContent) {
        globals.navbar = navbarContent;
      }
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