'use client';

import { createContext, useState, useEffect } from 'react';
import { type WebsiteContent } from './types/content';
import {
  requestWebsiteContent,
  parseContentFromUrl
} from '../../messaging/content/child/contentMessaging';
import { useEditingMode } from '../editing/EditingWrapper';
import { ContentContextType, ContentProviderProps } from './types/context';
import { useContentQueries } from './hooks/useContentQueries';
import { useContentBlocks } from './hooks/useContentBlocks';

// Create the context
export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children, initialContent = null }: ContentProviderProps) {
  const { isEditingMode, registerMessageHandlers } = useEditingMode();
  const [dynamicContent, setDynamicContent] = useState<WebsiteContent | null>(initialContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditingMode) {
      console.log('🌐 ContentProvider registering message handlers with central dispatcher');
      
      // Register content message handlers with the central dispatcher
      if (registerMessageHandlers) {
        registerMessageHandlers({
          onContentUpdate: (content: WebsiteContent) => {
            console.log('🌐 ContentProvider received content update:', content);
            setDynamicContent(content);
            setIsLoading(false);
          },
          onWebsiteContentResponse: (content: WebsiteContent) => {
            console.log('🌐 ContentProvider received website content response:', content);
            setDynamicContent(content);
            setIsLoading(false);
          }
        });
      }

      // Try to get content from URL first
      const urlContent = parseContentFromUrl();
      if (urlContent) {
        setDynamicContent(urlContent);
        setIsLoading(false);
        return;
      }

      // If no content in URL, request it from parent CMS
      requestWebsiteContent();
    } else {
      // In normal mode: use initialContent and set loading to false
      setDynamicContent(initialContent);
      setIsLoading(false);
    }
  }, [isEditingMode, initialContent, registerMessageHandlers]);

  // Get active content based on mode
  const getActiveContent = () => {
    return isEditingMode ? dynamicContent : (dynamicContent || initialContent);
  };

  const activeContent = getActiveContent();

  // Use the modular hooks
  const contentQueries = useContentQueries(activeContent);
  const contentBlocks = useContentBlocks();

  const contextValue: ContentContextType = {
    content: activeContent,
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