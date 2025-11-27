import { getAvailableLocales } from './loaders';

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


/**
 * Handle locale change by redirecting to root of selected locale
 */
export const handleLocaleChange = (router: any, value: string | null) => {
  if (value) {
    // Simply redirect to root of selected locale
    router.push(`/${value}`);
  }
};