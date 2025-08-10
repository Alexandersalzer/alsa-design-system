import { useMemo } from 'react';
import { WebsiteContent, LanguageContent } from '../types/content';
import { extractLocaleFromPathname } from '../../../../system/utils/navigation';

export interface ContentLanguageResult {
  // Current language content (filtered)
  currentContent: LanguageContent | null;
  
  // All available languages
  availableLanguages: Array<{
    code: string;
    name: string;
    is_default: boolean;
    is_active: boolean;
  }>;
  
  // Current language info
  currentLanguage: string;
  defaultLanguage: string;
  
  // Content mode information
  isMultiLanguageMode: boolean;
  fetchMode: 'single-language' | 'all-languages' | 'unknown';
  
  // Helper functions
  getContentForLanguage: (languageCode: string) => LanguageContent | null;
  hasLanguage: (languageCode: string) => boolean;
}

/**
 * Hook that handles language filtering and content selection
 * Works with both single-language (backward compatible) and multi-language modes
 */
export function useContentLanguage(
  content: WebsiteContent | null,
  requestedLanguage?: string
): ContentLanguageResult {
  return useMemo(() => {
    if (!content) {
      return {
        currentContent: null,
        availableLanguages: [],
        currentLanguage: 'sv',
        defaultLanguage: 'sv',
        isMultiLanguageMode: false,
        fetchMode: 'unknown',
        getContentForLanguage: () => null,
        hasLanguage: () => false
      };
    }

    // Determine fetch mode
    const fetchMode = content.meta?.fetchMode || 
      (content.languages ? 'all-languages' : 'single-language');
    
    const isMultiLanguageMode = fetchMode === 'all-languages' && !!content.languages;

    // Get available languages
    const availableLanguages = content.meta?.availableLanguages || [];
    const defaultLanguage = content.meta?.defaultLanguage || 
      availableLanguages.find(lang => lang.is_default)?.code || 'sv';

    // Determine current language
    const currentLanguage = requestedLanguage || 
      content.meta?.requestedLocale || 
      content.meta?.locale ||
      (typeof window !== 'undefined' ? extractLocaleFromPathname(window.location.pathname) : defaultLanguage) ||
      defaultLanguage;

    console.log('🌐 useContentLanguage:', {
      fetchMode,
      isMultiLanguageMode,
      currentLanguage,
      defaultLanguage,
      availableLanguages: availableLanguages.map(l => l.code),
      hasLanguages: !!content.languages,
      hasPages: !!content.pages
    });

    // Helper function to get content for specific language
    const getContentForLanguage = (languageCode: string): LanguageContent | null => {
      if (isMultiLanguageMode && content.languages) {
        return content.languages[languageCode] || null;
      }
      
      // Backward compatibility: if requesting current language and we have single-language data
      if (languageCode === currentLanguage && content.pages) {
        return {
          pages: content.pages,
          globals: content.globals || {},
          meta: {
            language: content.meta?.localeData || {
              code: currentLanguage,
              name: currentLanguage,
              is_default: currentLanguage === defaultLanguage,
              is_active: true
            }
          }
        };
      }
      
      return null;
    };

    // Helper function to check if language exists
    const hasLanguage = (languageCode: string): boolean => {
      if (isMultiLanguageMode && content.languages) {
        return !!content.languages[languageCode];
      }
      
      // Backward compatibility: check if it's the current language
      return languageCode === currentLanguage && !!content.pages;
    };

    // Get current content
    const currentContent = getContentForLanguage(currentLanguage);

    return {
      currentContent,
      availableLanguages,
      currentLanguage,
      defaultLanguage,
      isMultiLanguageMode,
      fetchMode,
      getContentForLanguage,
      hasLanguage
    };
  }, [content, requestedLanguage]);
} 