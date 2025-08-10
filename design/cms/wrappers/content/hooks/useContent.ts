import { useContext, useMemo } from 'react';
import { ContentContext } from '../ContentProvider';
import { 
  WebsiteContent, 
  LanguageContent,
  ContentTemplate, 
  ContentBlock, 
  GlobalComponent 
} from '../types/content';
import { 
  getPageTemplate as getPageTemplateFromUtils, 
  getPageTemplates as getPageTemplatesFromUtils, 
  getGlobalComponent as getGlobalComponentFromUtils,
  getTemplateBlocks as getTemplateBlocksFromUtils,
  getAllBlocks as getAllBlocksFromUtils
} from '../utils/contentQueries';
import { useContentBlocks } from './useContentBlocks';

// Hook for accessing and filtering website content
export function useContent(preferredLocale?: string) {
  const context = useContext(ContentContext);
  
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }

  const { content: rawContent, isLoading, error } = context;

  // Extract current locale from various sources
  const currentLocale = useMemo(() => {
    // Priority: 1) preferredLocale param, 2) URL pathname, 3) default from content, 4) fallback
    if (preferredLocale) return preferredLocale;
    
    // Extract from pathname if available
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const potentialLocale = pathSegments[0];
      if (potentialLocale === 'sv' || potentialLocale === 'en') {
        return potentialLocale;
      }
    }
    
    // Use default from content meta
    if (rawContent?.meta?.defaultLanguage) {
      return rawContent.meta.defaultLanguage;
    }
    
    return 'sv'; // Final fallback
  }, [preferredLocale, rawContent?.meta?.defaultLanguage]);

  // Filter content for current language with fallback to legacy structure
  const content = useMemo((): LanguageContent | null => {
    if (!rawContent) return null;

    // New multi-language structure
    if (rawContent.languages && rawContent.languages[currentLocale]) {
      console.log('🌐 Using filtered content for locale:', currentLocale);
      return rawContent.languages[currentLocale];
    }

    // Fallback to legacy structure (backward compatibility)
    if (rawContent.pages || rawContent.globals) {
      console.log('🔄 Using legacy content structure (no client-side filtering)');
      return {
        pages: rawContent.pages || {},
        globals: rawContent.globals || {},
        meta: rawContent.meta
      };
    }

    console.warn('⚠️ No content found for locale:', currentLocale);
    return null;
  }, [rawContent, currentLocale]);

  // Available languages from content meta
  const availableLanguages = useMemo(() => {
    return rawContent?.meta?.availableLanguages || [];
  }, [rawContent?.meta?.availableLanguages]);

  // Language switching function for client-side filtering
  const switchLanguage = (newLocale: string) => {
    console.log('🌐 Switching language to:', newLocale, '(client-side filtering)');
    
    // For client-side filtering, we just trigger a re-render with new locale
    // This is handled by the currentLocale useMemo dependency
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const segments = currentPath.split('/').filter(Boolean);
      
      // Remove current locale if it exists
      if (segments[0] === 'sv' || segments[0] === 'en') {
        segments.shift();
      }
      
      // Build new path with new locale
      const newPath = `/${newLocale}${segments.length > 0 ? '/' + segments.join('/') : ''}`;
      
      // Update URL without reload (for editing mode)
      window.history.pushState({}, '', newPath);
      
      // Trigger re-render by changing a state that components depend on
      // This will cause currentLocale to update and content to re-filter
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { locale: newLocale } }));
    }
  };

  // Content query functions using filtered content
  const getPageTemplate = (pageSlug: string, templateType: string, templateIndex: number = 0): ContentTemplate | undefined => {
    return getPageTemplateFromUtils(content, pageSlug, templateType, templateIndex);
  };

  const getPageTemplates = (pageSlug: string, templateType: string): ContentTemplate[] => {
    return getPageTemplatesFromUtils(content, pageSlug, templateType);
  };

  const getGlobalComponent = (componentType: string): GlobalComponent | undefined => {
    return getGlobalComponentFromUtils(content, componentType);
  };

  const getTemplateBlocks = (template: ContentTemplate | GlobalComponent | undefined, patternType?: string): ContentBlock[] => {
    return getTemplateBlocksFromUtils(template, patternType);
  };

  const getAllBlocks = (template: ContentTemplate | GlobalComponent | undefined): ContentBlock[] => {
    return getAllBlocksFromUtils(template);
  };

  // Block-specific functions
  const { getBlocksByType, getBlockContent, getBlockConfig } = useContentBlocks();

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 useContent debug:', {
      currentLocale,
      hasRawContent: !!rawContent,
      hasFilteredContent: !!content,
      availableLanguages: availableLanguages.map(l => l.code),
      contentStructure: rawContent?.languages ? 'multi-language' : 'legacy',
      pagesCount: Object.keys(content?.pages || {}).length,
      globalsCount: Object.keys(content?.globals || {}).length
    });
  }

  return {
    // Filtered content for current language
    content,
    
    // Raw multi-language content
    allContent: rawContent,
    
    // Language management
    currentLocale,
    availableLanguages,
    switchLanguage,
    
    // Loading states
    isLoading,
    error,
    
    // Content query functions
    getPageTemplate,
    getPageTemplates,
    getGlobalComponent,
    getTemplateBlocks,
    getAllBlocks,
    
    // Block query functions
    getBlocksByType,
    getBlockContent,
    getBlockConfig
  };
}

// Utility functions (keeping original names for backward compatibility)
function getPageTemplateUtil(content: LanguageContent | null, pageSlug: string, templateType: string, templateIndex: number = 0): ContentTemplate | undefined {
  return getPageTemplateFromUtils(content, pageSlug, templateType, templateIndex);
}

function getPageTemplatesUtil(content: LanguageContent | null, pageSlug: string, templateType: string): ContentTemplate[] {
  return getPageTemplatesFromUtils(content, pageSlug, templateType);
}

function getGlobalComponentUtil(content: LanguageContent | null, componentType: string): GlobalComponent | undefined {
  return getGlobalComponentFromUtils(content, componentType);
}

function getTemplateBlocksUtil(template: ContentTemplate | GlobalComponent | undefined, patternType?: string): ContentBlock[] {
  return getTemplateBlocksFromUtils(template, patternType);
}

function getAllBlocksUtil(template: ContentTemplate | GlobalComponent | undefined): ContentBlock[] {
  return getAllBlocksFromUtils(template);
} 