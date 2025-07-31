import { promises as fs } from 'fs';
import path from 'path';

interface LayoutItem {
  template: string;
  [key: string]: unknown;
}

/**
 * Load a global template/component file
 */
async function loadGlobalTemplate(locale: string, templateName: string) {
  try {
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
 */
async function loadPageLayout(locale: string, pageSlug: string) {
  try {
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
 * Load global navbar content for a specific locale
 */
export async function getGlobalNavbarContent(locale: string = 'sv') {
  try {
    const navbarPath = path.join(
      process.cwd(), 
      'public', 
      'content', 
      locale, 
      'globals',
      'navbar',
      'navbar.json'
    );
    const fileContent = await fs.readFile(navbarPath, 'utf8');
    const navbarData = JSON.parse(fileContent);
    
    // Add missing fields to match Template interface
    return {
      id: 1, // Global navbar always has ID 1
      position: 1,
      image_url: navbarData.image_url,
      ...navbarData,
      patterns: navbarData.patterns?.map((pattern: any, patternIndex: number) => ({
        id: patternIndex + 1,
        position: patternIndex + 1,
        ...pattern,
        blocks: pattern.blocks?.map((block: any, blockIndex: number) => ({
          id: blockIndex + 1,
          position: blockIndex + 1,
          ...block
        })) || []
      })) || []
    };
  } catch (error) {
    console.error(`Failed to load navbar content for locale ${locale}:`, error);
    // Fallback to Swedish if locale file doesn't exist
    if (locale !== 'sv') {
      return getGlobalNavbarContent('sv');
    }
    return null;
  }
}

/**
 * Load content for a specific page and locale using the separated structure
 */
export async function getPageContent(locale: string = 'sv', pageSlug: string) {
  try {
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
        layoutData.map(async (layoutItem: LayoutItem, index: number) => {
          // Always load from global templates directory
          const template = await loadGlobalTemplate(locale, layoutItem.template);
          if (template) {
            // Add missing fields to match Template interface
            return {
              id: index + 1, // Generate ID based on position
              position: index + 1,
              image_url: template.image_url,
              ...template,
              patterns: template.patterns?.map((pattern: any, patternIndex: number) => ({
                id: patternIndex + 1,
                position: patternIndex + 1,
                ...pattern,
                blocks: pattern.blocks?.map((block: any, blockIndex: number) => ({
                  id: blockIndex + 1,
                  position: blockIndex + 1,
                  ...block
                })) || []
              })) || []
            };
          }
          return null;
        })
      );
      
      // Return combined data with templates
      return {
        id: pageSlug, // Use slug as ID
        ...pageData,
        templates: templates.filter(t => t !== null)
      };
    }
    
    return {
      id: pageSlug, // Use slug as ID
      ...pageData,
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
 */
export async function getAllPagesContent(locale: string = 'sv') {
  try {
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

    // Load global navbar content from new location
    const navbarContent = await getGlobalNavbarContent(locale);
    
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
      globals: navbarContent ? {
        navbar: navbarContent
      } : undefined
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

/**
 * Get available locales by checking which content directories exist
 */
export async function getAvailableLocales(): Promise<string[]> {
  try {
    const contentDir = path.join(process.cwd(), 'public', 'content');
    const entries = await fs.readdir(contentDir, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  } catch (error) {
    console.error('Failed to get available locales:', error);
    return ['sv']; // Default fallback
  }
} 