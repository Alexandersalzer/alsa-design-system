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

  console.log(`📖 getPageContent called for ${pageSlug} in locale ${locale}`);

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
    
    console.log(`📄 Loading page.json from: ${pagePath}`);
    const pageContent = await fs.readFile(pagePath, 'utf8');
    const pageData = JSON.parse(pageContent);
    console.log(`📄 page.json content:`, JSON.stringify(pageData, null, 2));
    
    // Load layout.json separately
    const layoutData = await loadPageLayout(locale, pageSlug);
    console.log(`📐 layout.json content:`, JSON.stringify(layoutData, null, 2));
    
    // Load all templates referenced in the layout
    if (layoutData && Array.isArray(layoutData)) {
      console.log(`🎨 Loading ${layoutData.length} templates...`);
      const templates = await Promise.all(
        layoutData.map(async (layoutItem: LayoutItem) => {
          console.log(`🎨 Loading template: ${layoutItem.template}`);
          // Always load from global templates directory
          const template = await getTemplateContent(locale, layoutItem.template);
          if (template) {
            console.log(`🎨 Template ${layoutItem.template} content:`, JSON.stringify(template, null, 2));
          }
          return template; // Return natural structure without modifications
        })
      );
      
      // Return combined data with templates
      const result = {
        ...pageData,
        slug: pageSlug, // Ensure slug is set
        templates: templates.filter(t => t !== null)
      };
      
      console.log(`✅ getPageContent final result for ${pageSlug}:`, JSON.stringify(result, null, 2));
      return result;
    }
    
    const result = {
      ...pageData,
      slug: pageSlug, // Ensure slug is set
      templates: []
    };
    
    console.log(`✅ getPageContent final result for ${pageSlug} (no templates):`, JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error(`❌ Failed to load content for page ${pageSlug} in locale ${locale}:`, error);
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      console.log(`🔄 Falling back to Swedish for page ${pageSlug}`);
      return getPageContent('sv', pageSlug);
    }
    return null;
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

  console.log(`🌍 getGlobalComponentContent called for ${componentType} in locale ${locale}`);

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
    
    console.log(`🌍 Loading global component from: ${globalPath}`);
    const fileContent = await fs.readFile(globalPath, 'utf8');
    const globalData = JSON.parse(fileContent);
    
    console.log(`🌍 Global ${componentType} content:`, JSON.stringify(globalData, null, 2));
    
    // Return the natural JSON structure without artificial fields
    return globalData;
  } catch (error) {
    console.error(`❌ Failed to load ${componentType} content for locale ${locale}:`, error);
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      console.log(`🔄 Falling back to Swedish for global ${componentType}`);
      return getGlobalComponentContent('sv', componentType);
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

  console.log(`🚀 getAllPagesContent called with locale: ${locale}`);

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
    const pages = [];
    
    // Load from new pages structure
    const pagesDir = path.join(process.cwd(), 'public', 'content', locale, 'pages');
    console.log(`📁 Looking for pages in: ${pagesDir}`);
    
    const pageEntries = await fs.readdir(pagesDir, { withFileTypes: true });
    console.log(`📄 Found ${pageEntries.length} entries in pages directory:`, pageEntries.map(e => e.name));
    
    for (const entry of pageEntries) {
      if (entry.isDirectory()) {
        const pageSlug = entry.name;
        console.log(`📖 Loading page: ${pageSlug}`);
        const content = await getPageContent(locale, pageSlug);
        if (content) {
          console.log(`✅ Successfully loaded page ${pageSlug} FULL CONTENT:`, JSON.stringify(content, null, 2));
          pages.push(content);
        } else {
          console.log(`❌ Failed to load page ${pageSlug}`);
        }
      }
    }
    
    // Also check for any remaining direct JSON files (like about.json) for backward compatibility
    const contentDir = path.join(process.cwd(), 'public', 'content', locale);
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    const directFiles = entries.filter(entry => entry.isFile() && entry.name.endsWith('.json'));
    console.log(`📁 Found ${directFiles.length} direct JSON files:`, directFiles.map(f => f.name));
    
    for (const file of directFiles) {
      const pageSlug = file.name.replace('.json', '');
      try {
        const filePath = path.join(contentDir, file.name);
        const fileContent = await fs.readFile(filePath, 'utf8');
        const content = JSON.parse(fileContent);
        console.log(`✅ Loaded direct file ${file.name} FULL CONTENT:`, JSON.stringify(content, null, 2));
        pages.push(content);
      } catch (error) {
        console.error(`❌ Failed to load direct file ${file.name}:`, error);
      }
    }

    console.log(`📊 Total pages loaded: ${pages.length}`);

    // Load all global components
    const globals: { [key: string]: any } = {};
    
    try {
      const globalsDir = path.join(process.cwd(), 'public', 'content', locale, 'globals');
      console.log(`🌍 Looking for globals in: ${globalsDir}`);
      
      const globalEntries = await fs.readdir(globalsDir, { withFileTypes: true });
      console.log(`🌍 Found ${globalEntries.length} global entries:`, globalEntries.map(e => e.name));
      
      for (const entry of globalEntries) {
        if (entry.isDirectory()) {
          const componentType = entry.name;
          console.log(`🌍 Loading global component: ${componentType}`);
          const globalContent = await getGlobalComponentContent(locale, componentType);
          if (globalContent) {
            console.log(`✅ Successfully loaded global ${componentType} FULL CONTENT:`, JSON.stringify(globalContent, null, 2));
            globals[componentType] = globalContent;
          } else {
            console.log(`❌ Failed to load global ${componentType}`);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Failed to load globals directory for locale ${locale}:`, error);
      // Fallback to just navbar for backward compatibility
      const navbarContent = await getGlobalComponentContent(locale, 'navbar');
      if (navbarContent) {
        console.log(`🔄 Fallback: loaded navbar content FULL CONTENT:`, JSON.stringify(navbarContent, null, 2));
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

    const result = {
      pages: pagesObject,
      globals: Object.keys(globals).length > 0 ? globals : undefined
    };

    console.log(`🎉 getAllPagesContent FINAL RESULT for ${locale}:`, JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error(`💥 getAllPagesContent failed for locale ${locale}:`, error);
    // Fallback to Swedish if locale doesn't exist
    if (locale !== 'sv') {
      console.log(`🔄 Falling back to Swedish locale`);
      return getAllPagesContent('sv');
    }
    return null;
  }
} 