import { useContext } from 'react';
import { ContentContext } from '../ContentProvider';
import type { SupportedLocale } from '../../../../system/utils/locale';

export function useContent() {
  const context = useContext(ContentContext);
  
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  
  return context;
}

// Hook to get current locale (either from editing mode context or pathname fallback)
export function useCurrentLocale(): SupportedLocale {
  const context = useContext(ContentContext);
  
  if (!context) {
    throw new Error('useCurrentLocale must be used within a ContentProvider');
  }
  
  // In editing mode, use locale from context if available
  if (context.currentLocale) {
    return context.currentLocale;
  }
  
  // Fallback: extract from pathname (for normal mode or when context locale not available)
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const potentialLocale = segments[0];
    
    if (potentialLocale === 'sv' || potentialLocale === 'en') {
      return potentialLocale;
    }
  }
  
  return 'sv'; // Default fallback
} 