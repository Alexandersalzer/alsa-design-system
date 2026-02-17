/**
 * Runtime locale context for schema translations
 * Manages the current locale for schema rendering
 */

import type { SupportedLocale } from './types';

/**
 * Global locale state
 * Can be set by CMS dashboard or application context
 */
let currentLocale: SupportedLocale = 'sv';

/**
 * Locale change listeners
 */
const localeChangeListeners: Array<(locale: SupportedLocale) => void> = [];

/**
 * Get the current schema locale
 * @returns Current locale code
 */
export function getSchemaLocale(): SupportedLocale {
  return currentLocale;
}

/**
 * Set the current schema locale
 * Triggers locale change listeners (e.g., to regenerate schemas)
 * 
 * @param locale - New locale code
 */
export function setSchemaLocale(locale: SupportedLocale): void {
  if (locale === currentLocale) return;
  
  currentLocale = locale;
  
  // Notify all listeners
  localeChangeListeners.forEach((listener) => {
    try {
      listener(locale);
    } catch (error) {
      console.error('Error in locale change listener:', error);
    }
  });
}

/**
 * Subscribe to locale changes
 * @param listener - Function to call when locale changes
 * @returns Unsubscribe function
 */
export function onLocaleChange(
  listener: (locale: SupportedLocale) => void
): () => void {
  localeChangeListeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    const index = localeChangeListeners.indexOf(listener);
    if (index > -1) {
      localeChangeListeners.splice(index, 1);
    }
  };
}

/**
 * Detect locale from browser/environment
 * Can be used to initialize locale on app start
 * 
 * @returns Detected locale or default 'sv'
 */
export function detectLocale(): SupportedLocale {
  if (typeof navigator === 'undefined') return 'sv';
  
  const browserLang = navigator.language.toLowerCase();
  
  // Map browser language codes to supported locales
  if (browserLang.startsWith('sv')) return 'sv';
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('no') || browserLang.startsWith('nb') || browserLang.startsWith('nn')) return 'no';
  if (browserLang.startsWith('da')) return 'da';
  if (browserLang.startsWith('fi')) return 'fi';
  
  // Default to Swedish
  return 'sv';
}
