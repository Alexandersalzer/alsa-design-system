/**
 * Client-side locale switching utilities
 */
import { useRouter, usePathname, useParams } from 'next/navigation';

// Mapping of locale to start page slug
// This should be kept in sync with your actual start page slugs
export const START_PAGE_SLUGS: Record<string, string> = {
  'sv': 'start',
  'en': 'home'
};

/**
 * Hook for handling locale switching on the client side
 */
export function useLocaleSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  
  const switchLocale = async (newLocale: string) => {
    try {
      const currentLocale = params?.locale as string;
      const currentSlug = params?.slug as string;
      
      console.log(`Switching from ${currentLocale} to ${newLocale}`);
      
      // Get the start page slug for the new locale
      const startPageSlug = START_PAGE_SLUGS[newLocale] || 'home';
      
      // Build the new path to the start page of the new locale
      const newPath = `/${newLocale}/${startPageSlug}`;
      
      console.log(`Navigating to: ${newPath}`);
      
      // Navigate to the new locale's start page
      router.push(newPath);
      
    } catch (error) {
      console.error('Error switching locale:', error);
      
      // Fallback: just navigate to locale root
      router.push(`/${newLocale}`);
    }
  };
  
  return { switchLocale };
}

/**
 * Get the current locale from URL params
 */
export function useCurrentLocale(): string {
  const params = useParams();
  return (params?.locale as string) || 'sv';
}

/**
 * Build locale-aware URL for a given path
 */
export function useLocalePath() {
  const params = useParams();
  const currentLocale = (params?.locale as string) || 'sv';
  
  const buildPath = (path: string, locale?: string) => {
    const targetLocale = locale || currentLocale;
    
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    return `/${targetLocale}/${cleanPath}`;
  };
  
  return { buildPath, currentLocale };
}