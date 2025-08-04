import { promises as fs } from 'fs';
import path from 'path';

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

/**
 * Dynamic i18n configuration
 */
export async function getI18nConfig() {
  const availableLocales = await getAvailableLocales();
  
  return {
    defaultLocale: 'sv',
    locales: availableLocales,
  };
}

export type Locale = string; 