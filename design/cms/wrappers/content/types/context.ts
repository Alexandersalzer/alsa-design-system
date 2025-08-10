import type { WebsiteContent } from './content';
import type { SupportedLocale } from '../../../../system/utils/locale';

export interface ContentContextType {
  content: WebsiteContent | null;
  currentLocale: SupportedLocale | null; // Current locale in editing mode
  isLoading: boolean;
  error: string | null;
  
  // Query functions
  getPageContent: (pageSlug: string) => any;
  getGlobalComponent: (componentType: string) => any;
  getPageTemplate: (pageSlug: string, templateType: string, templateIndex?: number) => any;
  getPageTemplates: (pageSlug: string, templateType: string) => any[];
  getTemplatePattern: (template: any, patternType: string, patternIndex?: number) => any;
  getTemplatePatterns: (template: any, patternType: string) => any[];
  getTemplateBlocks: (template: any, patternType: string) => any[];
  getPatternBlocks: (pattern: any) => any[];
  
  // Block functions
  getBlocksByType: (blocks: any[], blockType: string) => any[];
  getBlockContent: (blocks: any[], blockType: string) => string | undefined;
  getBlockConfig: (blocks: any[], blockType: string) => any;
}

export interface ContentProviderProps {
  children: React.ReactNode;
  initialContent?: WebsiteContent | null;
} 