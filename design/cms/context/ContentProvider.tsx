'use client';

import React, { useState, ReactNode, useEffect } from 'react';
import { type WebsiteContent, type Page, type Template, type Pattern, type Block } from '../types/content';
import { 
  parseContentFromUrl, 
  getVersionFromUrl, 
  requestWebsiteContent, 
  setupMessageListener,
  type MessageHandlers 
} from '../messaging/pageMessaging';
import { 
  createDesignTokenMessageHandlers,
  type DesignTokenMessageHandlers 
} from '../messaging/designTokenMessaging';
import { ContentContext, type ContentContextType, type HeroContent, type NavbarContent } from './ContentContext';

interface ContentProviderProps {
  children: ReactNode;
  initialContent?: WebsiteContent | null;
}

export function ContentProvider({ children, initialContent = null }: ContentProviderProps) {
  const [staticContent, setStaticContent] = useState<WebsiteContent | null>(initialContent);
  const [dynamicContent, setDynamicContent] = useState<WebsiteContent | null>(null);
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string>('#268eba'); // Default accent color
  const [radius, setRadius] = useState<string>('md'); // Default radius
  const [fontName, setFontName] = useState<string>('Inter'); // Default font name

  // Handle dynamic content loading (URL parameters and postMessage)
  useEffect(() => {
    // Try to get content from URL parameters first
    const urlContent = parseContentFromUrl(); 
    if (urlContent) {
      setDynamicContent(urlContent); 
      return;
    }

    // If no content in URL, check for version parameter
    const versionId = getVersionFromUrl();
    if (versionId) {
      requestWebsiteContent(versionId);
    }

    const messageHandlers: MessageHandlers = {
      onContentUpdate: (content: WebsiteContent) => {
        setDynamicContent(content);
        setError(null);
      },
      onWebsiteContentResponse: (content: WebsiteContent) => {
        setDynamicContent(content);
        setError(null);
      }
    };

    const designTokenHandlers: DesignTokenMessageHandlers = createDesignTokenMessageHandlers({
      setAccentColor,
      setRadius,
      setFontName
    });

    // Set up message listener and get cleanup function
    const cleanup = setupMessageListener(messageHandlers, designTokenHandlers);
    
    return cleanup;
  }, []);

  // Update content when initialContent changes
  useEffect(() => {
    if (initialContent) {
      setStaticContent(initialContent);
      setError(null);
    }
  }, [initialContent]);

  // Use dynamic content if available, otherwise fall back to static content
  const activeContent = dynamicContent || staticContent;

  // Get hero content for a specific page
  const getHeroContent = (pageSlug: string): HeroContent | undefined => {
    if (!activeContent) return undefined;

    // Find the page
    let page: Page | undefined;
    if (Array.isArray(activeContent.pages)) {
      page = activeContent.pages.find((p: Page) => p.slug === pageSlug);
    } else {
      page = activeContent.pages[pageSlug];
    }

    if (!page) return undefined;

    // Look for hero content in templates -> patterns -> blocks
    const heroTemplate = page.templates.find((template: Template) => 
      template.type === 'hero-template' || 
      (template.patterns && template.patterns.some((pattern: Pattern) => pattern.type === 'hero'))
    );

    if (heroTemplate && heroTemplate.patterns) {
      // Find hero pattern
      const heroPattern = heroTemplate.patterns.find((pattern: Pattern) => pattern.type === 'hero');
      
      if (heroPattern && heroPattern.blocks) {
        // Extract content from blocks by type
        const blocks = heroPattern.blocks;
        
        const titleBlock = blocks.find((block: Block) => block.type === 'title');
        const subtitleBlock = blocks.find((block: Block) => block.type === 'subtitle');
        const primaryButtonBlock = blocks.find((block: Block) => block.type === 'primaryButton');
        const secondaryButtonBlock = blocks.find((block: Block) => block.type === 'secondaryButton');
        
        return {
          title: titleBlock?.content || '',
          subtitle: subtitleBlock?.content || '',
          primaryButtonText: primaryButtonBlock?.content || '',
          secondaryButtonText: secondaryButtonBlock?.content || ''
        };
      }
    }

    return undefined;
  };

  // Get navbar content from global template
  const getNavbarContent = (): NavbarContent | undefined => {
    if (!activeContent) return undefined;

    // Look for navbar content in global navbar template
    const navbarTemplate = activeContent.navbar;
    
    if (navbarTemplate && navbarTemplate.patterns) {
      // Find navbar pattern
      const navbarPattern = navbarTemplate.patterns.find((pattern: Pattern) => pattern.type === 'navbar');
      
      if (navbarPattern && navbarPattern.blocks) {
        // Extract nav items from blocks
        const navItems = navbarPattern.blocks
          .filter((block: Block) => block.type === 'navItem')
          .sort((a: Block, b: Block) => a.position - b.position)
          .map((block: Block) => ({
            label: block.content || '',
            slug: block.slug || ''
          }));
        
        return { navItems };
      }
    }

    return undefined;
  };

  const value: ContentContextType = {
    content: dynamicContent || staticContent,
    staticContent,
    dynamicContent,
    isLoading,
    error,
    accentColor,
    radius,
    fontName,
    getHeroContent,
    getNavbarContent
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
} 