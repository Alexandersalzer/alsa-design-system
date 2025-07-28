import { promises as fs } from 'fs';
import path from 'path';

/**
 * Load content for a specific page and locale
 */
export async function getPageContent(locale: string = 'sv', pageSlug: string) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'content', locale, `${pageSlug}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
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
    const contentDir = path.join(process.cwd(), 'public', 'content', locale);
    
    // Load all page files from the new structure
    const files = await fs.readdir(contentDir);
    const pageFiles = files.filter(file => file.endsWith('.json'));
    
    const pages = await Promise.all(
      pageFiles.map(async (file) => {
        const pageSlug = file.replace('.json', '');
        const content = await getPageContent(locale, pageSlug);
        return content;
      })
    );
    
    return {
      pages: pages.filter(Boolean) // Remove any null values
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