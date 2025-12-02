/**
 * Hook for accessing website content from postMessage
 * 
 * Returnerar website content som skickats via postMessage från parent
 * @author William
 * @since 2025-12-02
 */

'use client';

import { useEffect, useState } from 'react';

/**
 * Hook för att komma åt website content
 * Lyssnar på förändringar i globalt content state
 */
export function useWebsiteContent() {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    // Kontrollera om content redan finns globalt
    if (typeof window !== 'undefined' && (window as any).__WEBSITE_CONTENT__) {
      setContent((window as any).__WEBSITE_CONTENT__);
    }

    // Lyssna på content updates
    const handleContentUpdate = (event: CustomEvent) => {
      setContent(event.detail);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('websiteContentUpdated', handleContentUpdate as EventListener);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('websiteContentUpdated', handleContentUpdate as EventListener);
      }
    };
  }, []);

  return content;
}

/**
 * Utility function för att få specific page content
 * @param pageKey - Page key (t.ex. "start_sv", "about_en")
 */
export function usePageContent(pageKey: string) {
  const content = useWebsiteContent();
  return content?.pages?.[pageKey] || null;
}

/**
 * Utility function för att få alla pages för en viss locale
 * @param locale - Locale (t.ex. "sv", "en")
 */
export function usePagesByLocale(locale: string) {
  const content = useWebsiteContent();
  
  if (!content?.pages) return [];
  
  return Object.entries(content.pages)
    .filter(([key, page]) => (page as any)?.locale === locale)
    .map(([key, page]) => ({ key, ...(page as object) }));
}

/**
 * Utility function för att få global sections
 */
export function useGlobalSections() {
  const content = useWebsiteContent();
  return content?.globalSections || {};
}