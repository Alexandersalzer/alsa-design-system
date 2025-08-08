'use client';

import { createContext, useState, useEffect } from 'react';
import { type WebsiteContent } from './types/content';
import { useEditingMode } from '../editing/EditingWrapper';
import { ContentContextType, ContentProviderProps } from './types/context';
import { useContentQueries } from './hooks/useContentQueries';
import { useContentBlocks } from './hooks/useContentBlocks';

// Create the context
export const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children, initialContent = null }: ContentProviderProps) {
  const { 
    isEditingMode, 
    dynamicContent, 
    isContentLoading, 
    contentError 
  } = useEditingMode();

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
    isLoading: isContentLoading,
    error: contentError,
    ...contentQueries,
    ...contentBlocks
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
} 