import { useContext } from 'react';
import { ContentContext } from '../ContentProvider';

// Hook for accessing and filtering website content
export function useContent(preferredLocale?: string) {
  const context = useContext(ContentContext);
  
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }

  // Destructure everything from context - this avoids duplicate hook calls
  const { 
    content, 
    isLoading, 
    error,
    getPageTemplate: contextGetPageTemplate,
    getPageTemplates: contextGetPageTemplates,
    getGlobalComponent: contextGetGlobalComponent,
    getTemplateBlocks: contextGetTemplateBlocks,
    getAllBlocks: contextGetAllBlocks,
    getBlocksByType,
    getBlockContent,
    getBlockConfig
  } = context;

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
    
    // Content query functions (from context to avoid duplicate hooks)
    getPageTemplate: contextGetPageTemplate,
    getPageTemplates: contextGetPageTemplates,
    getGlobalComponent: contextGetGlobalComponent,
    getTemplateBlocks: contextGetTemplateBlocks,
    getAllBlocks: contextGetAllBlocks,
    
    // Block utilities (from context to avoid duplicate hooks)
    getBlocksByType,
    getBlockContent,
    getBlockConfig,
    
    // Language switching (limited functionality)
    switchLanguage
  };
} 