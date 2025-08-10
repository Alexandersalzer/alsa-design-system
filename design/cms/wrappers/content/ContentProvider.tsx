'use client';

import { createContext, useState, useEffect } from 'react';
import { type WebsiteContent } from './types/content';
import {
  requestWebsiteContent,
  setupMessageListener,
  type MessageHandlers
} from '../../messaging/content/child/contentMessaging';
import { useEditingMode } from '../editing/EditingWrapper';
import { ContentContextType, ContentProviderProps } from './types/context';
import { useContentQueries } from './hooks/useContentQueries';
import { useContentBlocks } from './hooks/useContentBlocks';
import { useContentLanguage } from './hooks/useContentLanguage';

// Create the context
export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children, initialContent = null }: ContentProviderProps) {
  const { isEditingMode } = useEditingMode();
  const [allContent, setAllContent] = useState<WebsiteContent | null>(initialContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditingMode) {
      console.log('📝 ContentProvider: Editing mode detected, requesting ALL LANGUAGES content from parent CMS API');
      
      // Request ALL content (no locale parameter = multi-language mode)
      requestWebsiteContent();

      const messageHandlers: MessageHandlers = {
        onContentUpdate: (content: WebsiteContent) => {
          console.log('🔄 ContentProvider: Received content update from parent:', {
            fetchMode: content.meta?.fetchMode,
            languages: content.languages ? Object.keys(content.languages).length : 0,
            pages: Object.keys(content.pages || {}).length,
            globals: Object.keys(content.globals || {}).length,
            isMultiLanguage: !!content.languages
          });
          setAllContent(content);
          setIsLoading(false);
          setError(null);
        },
        onWebsiteContentResponse: (content: WebsiteContent) => {
          console.log('✅ ContentProvider: Received website content response from parent API:', {
            fetchMode: content.meta?.fetchMode,
            languages: content.languages ? Object.keys(content.languages).length : 0,
            pages: Object.keys(content.pages || {}).length,
            globals: Object.keys(content.globals || {}).length,
            availableLanguages: content.meta?.availableLanguages?.map(l => l.code) || [],
            defaultLanguage: content.meta?.defaultLanguage,
            isMultiLanguage: !!content.languages
          });
          setAllContent(content);
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
          setAllContent(initialContent);
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
      setAllContent(initialContent);
      setIsLoading(false);
      setError(null);
    }
  }, [isEditingMode, initialContent, isLoading]);

  // Use the language filtering hook to get current language content
  const languageResult = useContentLanguage(allContent);
  
  // Get active content - use filtered language content or fallback to original structure
  const getActiveContent = () => {
    if (isEditingMode && languageResult.isMultiLanguageMode) {
      // Multi-language mode: return current language content in compatible format
      const currentContent = languageResult.currentContent;
      if (currentContent) {
        return {
          pages: currentContent.pages,
          globals: currentContent.globals,
          meta: {
            ...allContent?.meta,
            locale: languageResult.currentLanguage,
            localeData: currentContent.meta.language
          }
        } as WebsiteContent;
      }
    }
    
    // Fallback: return original content (backward compatibility or normal mode)
    return allContent || initialContent;
  };

  const activeContent = getActiveContent();

  // Use the modular hooks with filtered content
  const contentQueries = useContentQueries(activeContent);
  const contentBlocks = useContentBlocks();

  const contextValue: ContentContextType = {
    content: activeContent,
    allContent, // Provide access to all languages
    languageResult, // Provide language utilities
    isLoading,
    error,
    ...contentQueries,
    ...contentBlocks
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
} 