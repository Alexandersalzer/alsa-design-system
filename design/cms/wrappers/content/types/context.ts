import { 
  WebsiteContent, 
  ContentBlock, 
  ContentTemplate, 
  GlobalComponent,
  ContentPageV2,
  ContentSection,
  ContentPatternV2,
  ContentComponent,
  AnyWebsiteContent 
} from './content';

// Generic content context interface
export interface ContentContextType {
  content: AnyWebsiteContent | null;
  isLoading: boolean;
  error: string | null;
  
  // Legacy query functions (for old format)
  getPageTemplate: (pageSlug: string, templateType: string, templateIndex?: number) => ContentTemplate | undefined;
  getPageTemplateByLayoutIndex: (pageSlug: string, layoutIndex: number) => ContentTemplate | undefined;
  getPageTemplates: (pageSlug: string, templateType: string) => ContentTemplate[];
  getGlobalComponent: (componentType: string) => GlobalComponent | undefined;
  getTemplateBlocks: (template: ContentTemplate | GlobalComponent | undefined, patternType?: string) => ContentBlock[];
  getAllBlocks: (template: ContentTemplate | GlobalComponent | undefined) => ContentBlock[];
  
  // Component query functions (from useContentBlocks)
  getBlocksByType: (blocks: ContentBlock[], blockType: string) => ContentBlock[];
  getBlockContent: (blocks: ContentBlock[], blockType: string) => string | undefined;
  getBlockConfig: (blocks: ContentBlock[], blockType: string) => any;
  
  // V2 query functions (for new nested format)
  getPageV2: (pageSlug: string) => ContentPageV2 | null;
  getSectionV2: (page: ContentPageV2 | null, sectionType: string, index?: number) => ContentSection | null;
  getPatternV2: (section: ContentSection | null, patternType: string, index?: number) => ContentPatternV2 | null;
  getComponentV2: (pattern: ContentPatternV2 | null, componentType: string) => ContentComponent | null;
  getComponentContentV2: (component: ContentComponent | null) => string;
  getSectionContentV2: (page: ContentPageV2 | null, sectionType: string, patternType: string, componentType: string, sectionIndex?: number, patternIndex?: number) => string;
}

export interface ContentProviderProps {
  children: React.ReactNode;
  initialContent?: AnyWebsiteContent | null;
} 