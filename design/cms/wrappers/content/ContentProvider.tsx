'use client';

import { createContext, useState, useEffect, useMemo } from 'react';
import { type WebsiteContent, type LanguageContent } from './types/content';
import {
  requestWebsiteContent,
  setupMessageListener,
  type MessageHandlers
} from '../../messaging/content/child/contentMessaging';
import { useEditingMode } from '../editing/EditingWrapper';
import { ContentContextType, ContentProviderProps } from './types/context';
import { useContentQueries } from './hooks/useContentQueries';
import { useContentBlocks } from './hooks/useContentBlocks';

// Create the context
export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children, initialContent = null }: ContentProviderProps) {
  const { isEditingMode } = useEditingMode();
  
  // State for multi-language content from CMS
  const [allLanguagesContent, setAllLanguagesContent] = useState<WebsiteContent | null>(null);
  
  // State for current language selection (client-side filtering)
  const [currentLanguage, setCurrentLanguage] = useState<string>('sv');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determine active content based on mode and language selection
  const activeContent = useMemo((): WebsiteContent | null => {
    if (!isEditingMode) {
      // Normal mode: use static initialContent
      return initialContent;
    }

    if (!allLanguagesContent) {
      // Editing mode but no CMS content yet: use initialContent as fallback
      return initialContent;
    }

    // Check if we received multi-language content
    if (allLanguagesContent.languages && allLanguagesContent.meta.fetchMode === 'all-languages') {
      // NEW MULTI-LANGUAGE MODE: Filter by current language
      const languageContent = allLanguagesContent.languages[currentLanguage];
      
      if (languageContent) {
        console.log(`🌐 ContentProvider: Using multi-language content for ${currentLanguage}:`, {
          pages: Object.keys(languageContent.pages).length,
          globals: Object.keys(languageContent.globals).length
        });
        
        // Return in backward-compatible format
        return {
          pages: languageContent.pages,
          globals: languageContent.globals,
          meta: {
            ...allLanguagesContent.meta,
            locale: currentLanguage,
            localeData: languageContent.meta.language
          }
        };
      } else {
        console.warn(`⚠️ ContentProvider: No content found for language ${currentLanguage}, available:`, 
          Object.keys(allLanguagesContent.languages));
        
        // Fallback to default language
        const defaultLang = allLanguagesContent.meta.defaultLanguage || 'sv';
        const defaultContent = allLanguagesContent.languages[defaultLang];
        
        if (defaultContent) {
          return {
            pages: defaultContent.pages,
            globals: defaultContent.globals,
            meta: {
              ...allLanguagesContent.meta,
              locale: defaultLang,
              localeData: defaultContent.meta.language
            }
          };
        }
      }
    } else {
      // BACKWARD COMPATIBILITY MODE: Single language content
      console.log('🔄 ContentProvider: Using backward-compatible single language content');
      return allLanguagesContent;
    }

    return initialContent; // Final fallback
  }, [isEditingMode, allLanguagesContent, currentLanguage, initialContent]);

  // Get available languages from content
  const availableLanguages = useMemo(() => {
    if (!allLanguagesContent?.meta?.availableLanguages) return [];
    return allLanguagesContent.meta.availableLanguages;
  }, [allLanguagesContent]);

  // Function to switch language (client-side only, no API calls)
  const switchLanguage = (newLanguage: string) => {
    if (newLanguage !== currentLanguage) {
      console.log(`🌐 ContentProvider: Switching language from ${currentLanguage} to ${newLanguage} (client-side)`);
      setCurrentLanguage(newLanguage);
    }
  };

  useEffect(() => {
    if (isEditingMode) {
      console.log('📝 ContentProvider: Editing mode detected, requesting ALL languages content from parent CMS API');
      
      // Request ALL languages content (no locale parameter = get everything)
      requestWebsiteContent();

      const messageHandlers: MessageHandlers = {
        onContentUpdate: (content: WebsiteContent) => {
          console.log('🔄 ContentProvider: Received content update from parent:', {
            fetchMode: content.meta?.fetchMode,
            hasLanguages: !!content.languages,
            availableLanguages: content.meta?.availableLanguages?.map(l => l.code) || [],
            backwardCompatible: !!(content.pages && content.globals)
          });
          
          setAllLanguagesContent(content);
          
          // Set initial language from content metadata
          if (content.meta?.defaultLanguage && currentLanguage === 'sv') {
            setCurrentLanguage(content.meta.defaultLanguage);
          }
          
          setIsLoading(false);
          setError(null);
        },
        onWebsiteContentResponse: (content: WebsiteContent) => {
          console.log('✅ ContentProvider: Received website content response from parent API:', {
            fetchMode: content.meta?.fetchMode,
            hasLanguages: !!content.languages,
            availableLanguages: content.meta?.availableLanguages?.map(l => l.code) || [],
            backwardCompatible: !!(content.pages && content.globals)
          });
          
          setAllLanguagesContent(content);
          
          // Set initial language from content metadata
          if (content.meta?.defaultLanguage && currentLanguage === 'sv') {
            setCurrentLanguage(content.meta.defaultLanguage);
          }
          
          setIsLoading(false);
          setError(null);
        }
      };

      // Setup message listener
      const contentCleanup = setupMessageListener(messageHandlers);

      // Set a timeout to handle cases where parent doesn't respond
      const timeoutId = setTimeout(() => {
        if (isLoading) {
          console.warn('⚠️ ContentProvider: Timeout waiting for parent content, using initialContent fallback');
          setAllLanguagesContent(initialContent);
          setIsLoading(false);
          setError('Failed to load content from CMS API, using fallback content');
        }
      }, 5000); // 5 second timeout

      // Return cleanup function
      return () => {
        contentCleanup();
        clearTimeout(timeoutId);
      };
    } else {
      console.log('🏠 ContentProvider: Normal mode, using static initialContent');
      // In normal mode: use initialContent and set loading to false
      setAllLanguagesContent(initialContent);
      setIsLoading(false);
      setError(null);
    }
  }, [isEditingMode, initialContent, isLoading]);

  // Use the modular hooks
  const contentQueries = useContentQueries(activeContent);
  const contentBlocks = useContentBlocks();

  const contextValue: ContentContextType = {
    content: activeContent,
    isLoading,
    error,
    
    // Multi-language support
    currentLanguage,
    availableLanguages,
    switchLanguage,
    
    // Query functions
    ...contentQueries,
    ...contentBlocks
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
} 