import { useContext, useMemo } from 'react';
import { ContentContext } from '../ContentProvider';
import { 
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

  // Since ContentProvider now provides filtered LanguageContent,
  // we don't need to do client-side language filtering here anymore
  const content = rawContent;

  // Available languages would need to come from a different source
  // since we now receive filtered content
  const availableLanguages: any[] = [];

  // Language switching is now handled at the ContentProvider level
  // This function is kept for API compatibility but doesn't do filtering
  const switchLanguage = (newLocale: string) => {
    console.log('🌐 Language switch requested:', newLocale, '(handled by ContentProvider)');
    // In the new architecture, language switching should be handled
    // by updating the URL or through parent component state
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const pathParts = currentPath.split('/').filter(Boolean);
      
      // Replace first segment (locale) if it exists
      if (pathParts.length > 0 && (pathParts[0] === 'sv' || pathParts[0] === 'en')) {
        pathParts[0] = newLocale;
      } else {
        pathParts.unshift(newLocale);
      }
      
      const newPath = '/' + pathParts.join('/');
      window.location.href = newPath;
    }
  };

  // Content query functions - now work directly with LanguageContent
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

  // Use the contentBlocks hook for additional block utilities
  const contentBlocks = useContentBlocks();

  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 useContent debug:', {
      hasContent: !!content,
      isLoading,
      error,
      pagesCount: Object.keys(content?.pages || {}).length,
      globalsCount: Object.keys(content?.globals || {}).length,
      preferredLocale
    });
  }

  return {
    // Core content and state
    content,
    isLoading,
    error,
    
    // Language info (limited in new architecture)
    availableLanguages,
    currentLocale: preferredLocale || 'sv', // Fallback since we don't extract from content anymore
    
    // Content query functions
    getPageTemplate,
    getPageTemplates,
    getGlobalComponent,
    getTemplateBlocks,
    getAllBlocks,
    
    // Block utilities
    ...contentBlocks,
    
    // Language switching (limited functionality)
    switchLanguage
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