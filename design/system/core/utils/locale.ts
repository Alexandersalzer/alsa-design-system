/**
 * Locale utilities for language switching functionality
 */

/**
 * Extract current locale from pathname for picker display
 * Falls back to first option value if no locale found in path
 */
export const getPickerLocale = (pathname: string, options: { value: string; label: string }[] = []) => {
  const segments = pathname.split('/').filter(Boolean);
  return segments[0] || options?.[0]?.value || '';
};

/**
 * Handle locale change by redirecting to root of selected locale
 */
export const handleLocaleChange = (router: any, value: string | null) => {
  if (value) {
    // Simply redirect to root of selected locale
    router.push(`/${value}`);
  }
};