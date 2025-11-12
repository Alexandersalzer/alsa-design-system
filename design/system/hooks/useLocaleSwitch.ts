'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';

/**
 * Hook for switching locale while maintaining current page/slug
 * Handles the dynamic route structure: /[locale]/[slug]
 */
export const useLocaleSwitch = () => {
  const router = useRouter();
  const pathname = usePathname();

  const switchToLocale = useCallback((newLocale: string) => {
    // Current pathname format: /sv/hem or /en/home
    const pathSegments = pathname.split('/').filter(Boolean);
    
    if (pathSegments.length === 0) {
      // Root path, just go to new locale root
      router.push(`/${newLocale}`);
      return;
    }

    if (pathSegments.length === 1) {
      // Format: /sv (just locale), redirect to locale root
      router.push(`/${newLocale}`);
      return;
    }

    if (pathSegments.length >= 2) {
      // Format: /sv/hem or /sv/portfolio etc.
      const currentLocale = pathSegments[0];
      const slug = pathSegments[1];
      
      if (currentLocale === newLocale) {
        // Same locale, no need to navigate
        return;
      }

      // Build new path with new locale but same slug
      const newPath = `/${newLocale}/${slug}`;
      
      // Navigate to new locale version of current page
      router.push(newPath);
    }
  }, [router, pathname]);

  /**
   * Get current locale from pathname
   */
  const getCurrentLocale = useCallback(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    return pathSegments.length > 0 ? pathSegments[0] : 'sv'; // Default to 'sv'
  }, [pathname]);

  /**
   * Check if a locale is the current active locale
   */
  const isCurrentLocale = useCallback((locale: string) => {
    return getCurrentLocale() === locale;
  }, [getCurrentLocale]);

  return {
    switchToLocale,
    getCurrentLocale,
    isCurrentLocale
  };
};

export default useLocaleSwitch;