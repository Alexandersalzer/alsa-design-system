import { WebsiteContent, ContentBlock, ContentTemplate, GlobalComponent } from './content';
import { ContentLanguageResult } from '../hooks/useContentLanguage';

// Generic content context interface
export interface ContentContextType {
  content: WebsiteContent | null;
  
  // Multi-language support
  allContent?: WebsiteContent | null; // Access to all languages
  languageResult?: ContentLanguageResult; // Language filtering utilities
  
  isLoading: boolean;
  error: string | null;
  
  // Query functions
  getPageTemplate: (pageSlug: string, templateType: string, templateIndex?: number) => ContentTemplate | undefined;
  getPageTemplates: (pageSlug: string, templateType: string) => ContentTemplate[];
  getGlobalComponent: (componentType: string) => GlobalComponent | undefined;
  getTemplateBlocks: (template: ContentTemplate | GlobalComponent | undefined, patternType?: string) => ContentBlock[];
  getAllBlocks: (template: ContentTemplate | GlobalComponent | undefined) => ContentBlock[];
  
  // Block query functions (from useContentBlocks)
  getBlocksByType: (blocks: ContentBlock[], blockType: string) => ContentBlock[];
  getBlockContent: (blocks: ContentBlock[], blockType: string) => string | undefined;
  getBlockConfig: (blocks: ContentBlock[], blockType: string) => any;
}

export interface ContentProviderProps {
  children: React.ReactNode;
  initialContent?: WebsiteContent | null;
} 