/**
 * Get available locales by checking which content directories exist
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getAvailableLocales(): Promise<string[]> {
  // Only import fs on server-side
  if (typeof window !== 'undefined') {
    throw new Error('getAvailableLocales is only available on server-side');
  }

  try {
    const { promises: fs } = await import('fs');
    const path = await import('path');
    
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
 * Uses dynamic import to avoid bundling fs in browser
 */
export async function getI18nConfig() {
  if (typeof window !== 'undefined') {
    throw new Error('getI18nConfig is only available on server-side');
  }

  const availableLocales = await getAvailableLocales();
  
  return {
    defaultLocale: 'sv',
    locales: availableLocales,
  };
}

export type Locale = string; 