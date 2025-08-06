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
import { useEditingMode } from '../modules/initial/child/EditingWrapper';

// Interface for hero content - only text content
export interface HeroContent {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
}

// Interface for navbar content - navigation items with labels
export interface NavbarContent {
  navItems: Array<{
    label: string;
    slug: string;
  }>;
}

interface ContentContextType {
  content: WebsiteContent | null;
  isLoading: boolean;
  error: string | null;
  getHeroContent: (pageSlug: string) => HeroContent | undefined;
  getNavbarContent: () => NavbarContent | undefined;
}

interface ContentProviderProps {
  children: ReactNode;
  initialContent?: WebsiteContent | null;
}

export function ContentProvider({ children, initialContent = null }: ContentProviderProps) {
  const { isEditingMode } = useEditingMode();
  const [dynamicContent, setDynamicContent] = useState<WebsiteContent | null>(initialContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditingMode) {
      // In editing mode: try to get content from URL or listen for CMS messages
      const urlContent = parseContentFromUrl();
      if (urlContent) {
        setDynamicContent(urlContent);
        setIsLoading(false);
        return;
      }

      // If no content in URL, request it from parent CMS
      requestWebsiteContent();

      const messageHandlers: MessageHandlers = {
        onContentUpdate: (content: WebsiteContent) => {
          setDynamicContent(content);
          setIsLoading(false);
        },
        onWebsiteContentResponse: (content: WebsiteContent) => {
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
    } else {
      // In normal mode: use initialContent and set loading to false
      setDynamicContent(initialContent);
      setIsLoading(false);
    }
  }, [isEditingMode, initialContent]);

  // Function to get hero content for a specific page
  const getHeroContent = (pageSlug: string): HeroContent | undefined => {
    // In editing mode, prioritize dynamic content; in normal mode, use static content
    const activeContent = isEditingMode ? dynamicContent : (dynamicContent || initialContent);
    if (!activeContent?.pages) return undefined;

    // Find the page by slug
    const page = Object.values(activeContent.pages).find((p: any) => p.slug === pageSlug);
    if (!page?.templates) return undefined;

    // Find hero template
    const heroTemplate = page.templates.find((template: any) => template.type === 'hero');
    if (!heroTemplate?.patterns) return undefined;

    // Find hero pattern
    const heroPattern = heroTemplate.patterns.find((pattern: any) => pattern.type === 'hero');
    if (!heroPattern?.blocks) return undefined;

    // Extract content from blocks
    const title = heroPattern.blocks.find((block: any) => block.type === 'title')?.content || '';
    const subtitle = heroPattern.blocks.find((block: any) => block.type === 'subtitle')?.content || '';
    const primaryButtonText = heroPattern.blocks.find((block: any) => block.type === 'primaryButton')?.content || '';
    const secondaryButtonText = heroPattern.blocks.find((block: any) => block.type === 'secondaryButton')?.content || '';

    return {
      title,
      subtitle,
      primaryButtonText,
      secondaryButtonText
    };
  };

  // Function to get navbar content
  const getNavbarContent = (): NavbarContent | undefined => {
    // In editing mode, prioritize dynamic content; in normal mode, use static content
    const activeContent = isEditingMode ? dynamicContent : (dynamicContent || initialContent);
    if (!activeContent?.globals?.navbar?.patterns) return undefined;

    // Find navbar pattern
    const navbarPattern = activeContent.globals.navbar.patterns.find((pattern: any) => pattern.type === 'navbar');
    if (!navbarPattern?.blocks) return undefined;

    // Extract nav items from blocks
    const navItems = navbarPattern.blocks
      .filter((block: any) => block.type === 'navItem')
      .map((block: any) => ({
        label: block.content || '',
        slug: block.slug || ''
      }));

    return { navItems };
  };

  const contextValue: ContentContextType = {
    content: isEditingMode ? dynamicContent : (dynamicContent || initialContent),
    isLoading,
    error,
    getHeroContent,
    getNavbarContent
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