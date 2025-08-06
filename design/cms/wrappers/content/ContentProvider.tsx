'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type WebsiteContent } from '../../utils/content';
import {
  requestWebsiteContent,
  parseContentFromUrl,
  setupMessageListener,
  type MessageHandlers
} from '../../messaging/content/child/contentMessaging';
import { useEditingMode } from '../editing/EditingWrapper';

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

  // Log what initialContent we receive
  console.log(`🎯 ContentProvider received initialContent:`, {
    isNull: initialContent === null,
    hasPages: !!initialContent?.pages,
    pagesSlugs: initialContent?.pages ? Object.keys(initialContent.pages) : [],
    hasGlobals: !!initialContent?.globals,
    globalsTypes: initialContent?.globals ? Object.keys(initialContent.globals) : [],
    fullContent: initialContent ? JSON.stringify(initialContent, null, 2) : 'null'
  });

  useEffect(() => {
    console.log(`🔄 ContentProvider useEffect - isEditingMode: ${isEditingMode}`);
    
    if (isEditingMode) {
      // In editing mode: try to get content from URL or listen for CMS messages
      const urlContent = parseContentFromUrl();
      if (urlContent) {
        console.log(`📡 Using URL content in editing mode`);
        setDynamicContent(urlContent);
        setIsLoading(false);
        return;
      }

      // If no content in URL, request it from parent CMS
      console.log(`📡 Requesting content from parent CMS`);
      requestWebsiteContent();

      const messageHandlers: MessageHandlers = {
        onContentUpdate: (content: WebsiteContent) => {
          console.log(`📡 Received content update from CMS`);
          setDynamicContent(content);
          setIsLoading(false);
        },
        onWebsiteContentResponse: (content: WebsiteContent) => {
          console.log(`📡 Received website content response from CMS`);
          setDynamicContent(content);
          setIsLoading(false);
        }
      };

      // Setup message listener
      const contentCleanup = setupMessageListener(messageHandlers);

      // Return cleanup function
      return () => {
        contentCleanup();
      };
    } else {
      // In normal mode: use initialContent and set loading to false
      console.log(`📦 Using initialContent in normal mode`);
      setDynamicContent(initialContent);
      setIsLoading(false);
    }
  }, [isEditingMode, initialContent]);

  // Function to get hero content for a specific page
  const getHeroContent = (pageSlug: string): HeroContent | undefined => {
    console.log(`🦸 getHeroContent called for pageSlug: ${pageSlug}`);
    
    // In editing mode, prioritize dynamic content; in normal mode, use static content
    const activeContent = isEditingMode ? dynamicContent : (dynamicContent || initialContent);
    console.log(`🦸 Using activeContent:`, {
      isEditingMode,
      hasActiveContent: !!activeContent,
      hasPages: !!activeContent?.pages,
      pagesSlugs: activeContent?.pages ? Object.keys(activeContent.pages) : []
    });
    
    if (!activeContent?.pages) {
      console.log(`❌ No pages found in activeContent`);
      return undefined;
    }

    // Find the page by slug
    const page = Object.values(activeContent.pages).find((p: any) => p.slug === pageSlug);
    console.log(`🦸 Found page for slug ${pageSlug}:`, {
      found: !!page,
      pageData: page ? JSON.stringify(page, null, 2) : 'not found'
    });
    
    if (!page?.templates) {
      console.log(`❌ No templates found in page ${pageSlug}`);
      return undefined;
    }

    // Find hero template
    const heroTemplate = page.templates.find((template: any) => template.type === 'hero');
    console.log(`🦸 Found hero template:`, {
      found: !!heroTemplate,
      templateData: heroTemplate ? JSON.stringify(heroTemplate, null, 2) : 'not found'
    });
    
    if (!heroTemplate?.patterns) {
      console.log(`❌ No patterns found in hero template`);
      return undefined;
    }

    // Find hero pattern
    const heroPattern = heroTemplate.patterns.find((pattern: any) => pattern.type === 'hero');
    console.log(`🦸 Found hero pattern:`, {
      found: !!heroPattern,
      patternData: heroPattern ? JSON.stringify(heroPattern, null, 2) : 'not found'
    });
    
    if (!heroPattern?.blocks) {
      console.log(`❌ No blocks found in hero pattern`);
      return undefined;
    }

    // Extract content from blocks
    const title = heroPattern.blocks.find((block: any) => block.type === 'title')?.content || '';
    const subtitle = heroPattern.blocks.find((block: any) => block.type === 'subtitle')?.content || '';
    const primaryButtonText = heroPattern.blocks.find((block: any) => block.type === 'primaryButton')?.content || '';
    const secondaryButtonText = heroPattern.blocks.find((block: any) => block.type === 'secondaryButton')?.content || '';

    const result = {
      title,
      subtitle,
      primaryButtonText,
      secondaryButtonText
    };
    
    console.log(`✅ getHeroContent result for ${pageSlug}:`, result);
    return result;
  };

  // Function to get navbar content
  const getNavbarContent = (): NavbarContent | undefined => {
    console.log(`🧭 getNavbarContent called`);
    
    // In editing mode, prioritize dynamic content; in normal mode, use static content
    const activeContent = isEditingMode ? dynamicContent : (dynamicContent || initialContent);
    console.log(`🧭 Using activeContent:`, {
      isEditingMode,
      hasActiveContent: !!activeContent,
      hasGlobals: !!activeContent?.globals,
      globalsTypes: activeContent?.globals ? Object.keys(activeContent.globals) : []
    });
    
    if (!activeContent?.globals?.navbar?.patterns) {
      console.log(`❌ No navbar patterns found in globals`);
      return undefined;
    }

    // Find navbar pattern
    const navbarPattern = activeContent.globals.navbar.patterns.find((pattern: any) => pattern.type === 'navbar');
    console.log(`🧭 Found navbar pattern:`, {
      found: !!navbarPattern,
      patternData: navbarPattern ? JSON.stringify(navbarPattern, null, 2) : 'not found'
    });
    
    if (!navbarPattern?.blocks) {
      console.log(`❌ No blocks found in navbar pattern`);
      return undefined;
    }

    // Extract nav items from blocks
    const navItems = navbarPattern.blocks
      .filter((block: any) => block.type === 'navItem')
      .map((block: any) => ({
        label: block.content || '',
        slug: block.slug || ''
      }));

    const result = { navItems };
    console.log(`✅ getNavbarContent result:`, result);
    return result;
  };

  const contextValue: ContentContextType = {
    content: isEditingMode ? dynamicContent : (dynamicContent || initialContent),
    isLoading,
    error,
    getHeroContent,
    getNavbarContent
  };

  console.log(`🎯 ContentProvider context value:`, {
    hasContent: !!contextValue.content,
    isLoading: contextValue.isLoading,
    error: contextValue.error
  });

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