/**
 * Browser version - throws error since fs is not available
 */
export async function getAvailableLocales(): Promise<string[]> {
  throw new Error('getAvailableLocales is only available on server-side (Node.js)');
}

/**
 * Browser version - throws error since fs is not available
 */
export async function getI18nConfig() {
  throw new Error('getI18nConfig is only available on server-side (Node.js)');
}

export type Locale = string; 