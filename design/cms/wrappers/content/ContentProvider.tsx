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

// Generic interfaces that match database structure
export interface Block {
  type: string;
  content?: string;
  image_url?: string;
  config?: any;
  slug?: string;
  position?: number;
}

export interface Pattern {
  type: string;
  blocks?: Block[];
  config?: any;
  position?: number;
}

export interface Template {
  type: string;
  patterns: Pattern[];
  position?: number;
  image_url?: string;
}

export interface GlobalComponent {
  type: string;
  patterns: Pattern[];
}

export interface Page {
  type: string;
  language: string;
  slug: string;
  templates: Template[];
}

// Generic content context interface
interface ContentContextType {
  content: WebsiteContent | null;
  isLoading: boolean;
  error: string | null;
  // Generic functions for any template/component type
  getPageTemplate: (pageSlug: string, templateType: string) => Template | undefined;
  getGlobalComponent: (componentType: string) => GlobalComponent | undefined;
  getTemplateBlocks: (template: Template | GlobalComponent | undefined, patternType?: string) => Block[];
  getBlocksByType: (blocks: Block[], blockType: string) => Block[];
  getBlockContent: (blocks: Block[], blockType: string) => string | undefined;
  getBlockConfig: (blocks: Block[], blockType: string) => any;
  getAllBlocks: (template: Template | GlobalComponent | undefined) => Block[];
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

  console.log(`🎯 ContentProvider received initialContent:`, {
    isNull: initialContent === null,
    hasPages: !!initialContent?.pages,
    pagesSlugs: initialContent?.pages ? Object.keys(initialContent.pages) : [],
    hasGlobals: !!initialContent?.globals,
    globalsTypes: initialContent?.globals ? Object.keys(initialContent.globals) : []
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

  // Get active content based on mode
  const getActiveContent = () => {
    return isEditingMode ? dynamicContent : (dynamicContent || initialContent);
  };

  // Generic function to get a specific template from a page
  const getPageTemplate = (pageSlug: string, templateType: string): Template | undefined => {
    console.log(`📄 getPageTemplate called for pageSlug: ${pageSlug}, templateType: ${templateType}`);
    
    const activeContent = getActiveContent();
    if (!activeContent?.pages) {
      console.log(`❌ No pages found in activeContent`);
      return undefined;
    }

    // Find the page by slug
    const page = Object.values(activeContent.pages).find((p: any) => p.slug === pageSlug);
    if (!page?.templates) {
      console.log(`❌ No templates found in page ${pageSlug}`);
      return undefined;
    }

    // Find template by type
    const template = page.templates.find((template: any) => template.type === templateType);
    console.log(`📄 Found template ${templateType}:`, !!template);
    
    return template;
  };

  // Generic function to get a global component
  const getGlobalComponent = (componentType: string): GlobalComponent | undefined => {
    console.log(`🌍 getGlobalComponent called for componentType: ${componentType}`);
    
    const activeContent = getActiveContent();
    if (!activeContent?.globals) {
      console.log(`❌ No globals found in activeContent`);
      return undefined;
    }

    const component = activeContent.globals[componentType];
    console.log(`🌍 Found global component ${componentType}:`, !!component);
    
    return component;
  };

  // Generic function to get blocks from a template or global component
  const getTemplateBlocks = (template: Template | GlobalComponent | undefined, patternType?: string): Block[] => {
    console.log(`🧩 getTemplateBlocks called for patternType: ${patternType || 'any'}`);
    
    if (!template?.patterns) {
      console.log(`❌ No patterns found in template`);
      return [];
    }

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
  const getAllBlocks = (template: Template | GlobalComponent | undefined): Block[] => {
    console.log(`🧩 getAllBlocks called`);
    
    if (!template?.patterns) {
      console.log(`❌ No patterns found in template`);
      return [];
    }

    // Flatten all blocks from all patterns
    const allBlocks = template.patterns.reduce((acc: Block[], pattern) => {
      if (pattern.blocks) {
        acc.push(...pattern.blocks);
      }
      return acc;
    }, []);

    console.log(`🧩 Found ${allBlocks.length} total blocks`);
    return allBlocks;
  };

  // Generic function to filter blocks by type
  const getBlocksByType = (blocks: Block[], blockType: string): Block[] => {
    console.log(`🔍 getBlocksByType called for blockType: ${blockType}`);
    
    const filteredBlocks = blocks.filter(block => block.type === blockType);
    console.log(`🔍 Found ${filteredBlocks.length} blocks of type ${blockType}`);
    
    return filteredBlocks;
  };

  // Generic function to get content from the first block of a specific type
  const getBlockContent = (blocks: Block[], blockType: string): string | undefined => {
    console.log(`📝 getBlockContent called for blockType: ${blockType}`);
    
    const block = blocks.find(block => block.type === blockType);
    const content = block?.content;
    
    console.log(`📝 Found content for ${blockType}:`, content || 'none');
    return content;
  };

  // Generic function to get config from the first block of a specific type
  const getBlockConfig = (blocks: Block[], blockType: string): any => {
    console.log(`⚙️ getBlockConfig called for blockType: ${blockType}`);
    
    const block = blocks.find(block => block.type === blockType);
    const config = block?.config;
    
    console.log(`⚙️ Found config for ${blockType}:`, config || 'none');
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