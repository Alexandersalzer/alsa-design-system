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

// Generic interfaces that match database structure - renamed to avoid conflicts
export interface ContentBlock {
  type: string;
  content?: string;
  image_url?: string;
  config?: any;
  slug?: string;
  position?: number;
}

export interface ContentPattern {
  type: string;
  blocks?: ContentBlock[];
  config?: any;
  position?: number;
}

export interface ContentTemplate {
  type: string;
  patterns: ContentPattern[];
  position?: number;
  image_url?: string;
}

export interface GlobalComponent {
  type: string;
  patterns: ContentPattern[];
}

export interface ContentPage {
  type: string;
  language: string;
  slug: string;
  templates: ContentTemplate[];
}

// Generic content context interface
interface ContentContextType {
  content: WebsiteContent | null;
  isLoading: boolean;
  error: string | null;
  // Generic functions for any template/component type
  getPageTemplate: (pageSlug: string, templateType: string) => ContentTemplate | undefined;
  getGlobalComponent: (componentType: string) => GlobalComponent | undefined;
  getTemplateBlocks: (template: ContentTemplate | GlobalComponent | undefined, patternType?: string) => ContentBlock[];
  getBlocksByType: (blocks: ContentBlock[], blockType: string) => ContentBlock[];
  getBlockContent: (blocks: ContentBlock[], blockType: string) => string | undefined;
  getBlockConfig: (blocks: ContentBlock[], blockType: string) => any;
  getAllBlocks: (template: ContentTemplate | GlobalComponent | undefined) => ContentBlock[];
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

      // Setup message listener
      const contentCleanup = setupMessageListener(messageHandlers);

      // Return cleanup function
      return () => {
        contentCleanup();
      };
    } else {
      // In normal mode: use initialContent and set loading to false
      setDynamicContent(initialContent);
      setIsLoading(false);
    }
  }, [isEditingMode, initialContent]);

  // Get active content based on mode
  const getActiveContent = () => {
    return isEditingMode ? dynamicContent : (dynamicContent || initialContent);
  };

  // Generic function to get a specific template from a page
  const getPageTemplate = (pageSlug: string, templateType: string): ContentTemplate | undefined => {
    const activeContent = getActiveContent();
    if (!activeContent?.pages) return undefined;

    // Find the page by slug
    const page = Object.values(activeContent.pages).find((p: any) => p.slug === pageSlug);
    if (!page?.templates) return undefined;

    // Find template by type
    const template = page.templates.find((template: any) => template.type === templateType);
    return template;
  };

  // Generic function to get a global component
  const getGlobalComponent = (componentType: string): GlobalComponent | undefined => {
    const activeContent = getActiveContent();
    if (!activeContent?.globals) return undefined;

    const component = activeContent.globals[componentType];
    return component;
  };

  // Generic function to get blocks from a template or global component
  const getTemplateBlocks = (template: ContentTemplate | GlobalComponent | undefined, patternType?: string): ContentBlock[] => {
    if (!template?.patterns) return [];

    // If patternType is specified, find that specific pattern
    if (patternType) {
      const pattern = template.patterns.find(p => p.type === patternType);
      return pattern?.blocks || [];
    }

    // Otherwise, return blocks from the first pattern (default behavior)
    const firstPattern = template.patterns[0];
    return firstPattern?.blocks || [];
  };

  // Generic function to get all blocks from all patterns in a template
  const getAllBlocks = (template: ContentTemplate | GlobalComponent | undefined): ContentBlock[] => {
    if (!template?.patterns) return [];

    // Flatten all blocks from all patterns
    const allBlocks = template.patterns.reduce((acc: ContentBlock[], pattern) => {
      if (pattern.blocks) {
        acc.push(...pattern.blocks);
      }
      return acc;
    }, []);

    return allBlocks;
  };

  // Generic function to filter blocks by type
  const getBlocksByType = (blocks: ContentBlock[], blockType: string): ContentBlock[] => {
    const filteredBlocks = blocks.filter(block => block.type === blockType);
    return filteredBlocks;
  };

  // Generic function to get content from the first block of a specific type
  const getBlockContent = (blocks: ContentBlock[], blockType: string): string | undefined => {
    const block = blocks.find(block => block.type === blockType);
    const content = block?.content;
    return content;
  };

  // Generic function to get config from the first block of a specific type
  const getBlockConfig = (blocks: ContentBlock[], blockType: string): any => {
    const block = blocks.find(block => block.type === blockType);
    const config = block?.config;
    return config;
  };

  const contextValue: ContentContextType = {
    content: getActiveContent(),
    isLoading,
    error,
    getPageTemplate,
    getGlobalComponent,
    getTemplateBlocks,
    getBlocksByType,
    getBlockContent,
    getBlockConfig,
    getAllBlocks
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