/**
 * Language Configuration & Utilities
 * Central source of truth for all language-related logic
 */

export interface LanguageConfig {
  code: string;           // "sv"
  name: string;           // "Swedish"
  nativeName: string;     // "Svenska"
  localeCode: string;     // "sv-SE"
  ogLocale: string;       // "sv_SE"
  countryCode: string;    // "SE"
}

/**
 * Hardcoded language configurations
 * This is the source of truth for all language-related mappings
 * Synced with database but can be used without DB connection
 */
export const LANGUAGES: Record<string, LanguageConfig> = {
  'sv': {
    code: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    localeCode: 'sv-SE',
    ogLocale: 'sv_SE',
    countryCode: 'SE',
  },
  'en': {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    localeCode: 'en-US',
    ogLocale: 'en_US',
    countryCode: 'US',
  },
};

/**
 * Get language config by code
 */
export function getLanguage(code: string): LanguageConfig | undefined {
  return LANGUAGES[code];
}

/**
 * Get Open Graph locale format from language code
 * @example getOgLocale('sv') => 'sv_SE'
 */
export function getOgLocale(code: string): string {
  return LANGUAGES[code]?.ogLocale || 'en_US';
}

/**
 * Get full locale code from language code
 * @example getLocaleCode('sv') => 'sv-SE'
 */
export function getLocaleCode(code: string): string {
  return LANGUAGES[code]?.localeCode || 'en-US';
}

/**
 * Build language alternates object for metadata
 * @example buildLanguageAlternates(['sv', 'en'], 'https://example.com', '/page')
 * => { 'sv-SE': 'https://example.com/sv/page', 'en-US': 'https://example.com/en/page' }
 */
export function buildLanguageAlternates(
  locales: string[],
  baseUrl: string,
  path: string = ''
): Record<string, string> {
  const alternates: Record<string, string> = {};
  
  for (const locale of locales) {
    const localeCode = getLocaleCode(locale);
    alternates[localeCode] = `${baseUrl}/${locale}${path}`;
  }
  
  return alternates;
}
