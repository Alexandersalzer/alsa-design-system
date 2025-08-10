import { WebsiteContent, ContentBlock, ContentTemplate, GlobalComponent } from './content';

// Generic content context interface
export interface ContentContextType {
  content: WebsiteContent | null;
  isLoading: boolean;
  error: string | null;
  
  // Multi-language support
  currentLanguage: string;
  availableLanguages: Array<{
    code: string;
    name: string;
    is_default: boolean;
    is_active: boolean;
  }>;
  switchLanguage: (language: string) => void;
  
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