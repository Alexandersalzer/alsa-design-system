import { WebsiteContent, ContentBlock, ContentTemplate, GlobalComponent } from './content';

// Generic content context interface
export interface ContentContextType {
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

export interface ContentProviderProps {
  children: React.ReactNode;
  initialContent?: WebsiteContent | null;
} 