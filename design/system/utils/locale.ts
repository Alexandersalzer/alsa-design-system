/**
 * Locale utilities for language switching in Next.js applications
 * Used by Picker component for language selection functionality
 */

export type SupportedLocale = 'sv' | 'en';

export interface LocaleOption {
  value: SupportedLocale;
  label: string;
  flag?: string;
}

/**
 * Default locale options for Swedish and English
 */
export const defaultLocaleOptions: LocaleOption[] = [
  {
    value: 'sv',
    label: 'Svenska',
    flag: 'fi fi-se' // Swedish flag
  },
  {
    value: 'en',
    label: 'English',
    flag: 'fi fi-gb' // UK flag
  }
];

/**
 * Get current locale from URL pathname
 * Works with Next.js [locale] dynamic routes
 */
export function getCurrentLocale(): SupportedLocale {
  if (typeof window === 'undefined') {
    return 'sv'; // Default for SSR
  }
  
  const pathname = window.location.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const potentialLocale = segments[0];
  
  if (potentialLocale === 'sv' || potentialLocale === 'en') {
    return potentialLocale;
  }
  
  return 'sv'; // Default fallback
}

/**
 * Navigate to a different locale while preserving the current page
 * Works with Next.js [locale] dynamic routes
 */
export function switchLocale(newLocale: SupportedLocale): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  const currentPath = window.location.pathname;
  const segments = currentPath.split('/').filter(Boolean);
  
  // Remove current locale if it exists
  if (segments[0] === 'sv' || segments[0] === 'en') {
    segments.shift();
  }
  
  // Build new path with new locale
  const newPath = `/${newLocale}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
  
  // Navigate to new locale
  window.location.href = newPath;
}

/**
 * Create a language picker change handler for Picker component
 * Returns a function that can be used as onChange prop
 */
export function createLanguageChangeHandler() {
  return (selectedOption: { value: string; label: string }) => {
    const locale = selectedOption.value as SupportedLocale;
    switchLocale(locale);
  };
}

/**
 * Get locale option by value
 */
export function getLocaleOption(locale: SupportedLocale): LocaleOption | undefined {
  return defaultLocaleOptions.find(option => option.value === locale);
}

/**
 * Check if a string is a supported locale
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locale === 'sv' || locale === 'en';
} 