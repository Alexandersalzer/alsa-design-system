'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type WebsiteContent } from '../types/content';
import {
  requestWebsiteContent,
  parseContentFromUrl,
  setupMessageListener,
  type MessageHandlers
} from '../modules/content/child/contentMessaging';
import {
  setupDesignTokenMessageListener,
  createDesignTokenMessageHandlers,
  type DesignTokenMessageHandlers
} from '../modules/design/child/designTokenMessaging';

interface ContentContextType {
  content: WebsiteContent | null;
  isLoading: boolean;
  error: string | null;
}

interface ContentProviderProps {
  children: ReactNode;
  initialContent?: WebsiteContent | null;
}

export function ContentProvider({ children, initialContent = null }: ContentProviderProps) {
  const [dynamicContent, setDynamicContent] = useState<WebsiteContent | null>(initialContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ContentProvider: Setting up content loading...');

    // First, try to get content from URL
    const urlContent = parseContentFromUrl();
    if (urlContent) {
      console.log('ContentProvider: Found content in URL');
      setDynamicContent(urlContent);
      setIsLoading(false);
      return;
    }

    // If no content in URL, request it from parent
    console.log('ContentProvider: No content in URL, requesting from parent...');
    requestWebsiteContent(); // Simplified - no versionId needed

    const messageHandlers: MessageHandlers = {
      onContentUpdate: (content: WebsiteContent) => {
        console.log('ContentProvider: Received content update');
        setDynamicContent(content);
        setIsLoading(false);
      },
      onWebsiteContentResponse: (content: WebsiteContent) => {
        console.log('ContentProvider: Received website content response');
        setDynamicContent(content);
        setIsLoading(false);
      }
    };

    // Setup design token message handlers
    const designTokenHandlers: DesignTokenMessageHandlers = createDesignTokenMessageHandlers({
      setAccentColor: (color: string) => {
        console.log('🎨 Design token: Accent color updated to:', color);
      },
      setRadius: (size: string) => {
        console.log('🔄 Design token: Radius updated to:', size);
      },
      setIsDark: (isDark: boolean) => {
        console.log('🌗 Design token: Theme updated to:', isDark ? 'dark' : 'light');
      },
      setFontName: (fontName: string) => {
        console.log('🔤 Design token: Font updated to:', fontName);
      }
    });

    // Setup message listeners
    const contentCleanup = setupMessageListener(messageHandlers);
    const designCleanup = setupDesignTokenMessageListener(designTokenHandlers);

    // Combined cleanup function
    return () => {
      contentCleanup();
      designCleanup();
    };
  }, []); // No dependencies needed

  const contextValue: ContentContextType = {
    content: dynamicContent,
    isLoading,
    error
  };

  return (
    <ContentContext.Provider value={contextValue}>
      {children}
    </ContentContext.Provider>
  );
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
} 