import { useCallback } from 'react';
import { WebsiteContent, AnyWebsiteContent, ContentBlock, ContentTemplate, GlobalComponent } from '../types/content';
import * as queries from '../utils/contentQueries';

/**
 * Hook that provides query functions bound to current content
 * Only works with legacy WebsiteContent format
 */
export function useContentQueries(content: AnyWebsiteContent | null) {
  // Cast to WebsiteContent for legacy queries
  const legacyContent = content && 'pages' in content && Object.values(content.pages).some((p: any) => 'templates' in p)
    ? content as WebsiteContent
    : null;
  // Bind query functions to current content
  const getPageTemplate = useCallback((pageSlug: string, templateType: string, templateIndex: number = 0): ContentTemplate | undefined => {
    return queries.getPageTemplate(legacyContent, pageSlug, templateType, templateIndex);
  }, [legacyContent]);

  const getPageTemplateByLayoutIndex = useCallback((pageSlug: string, layoutIndex: number): ContentTemplate | undefined => {
    return queries.getPageTemplateByLayoutIndex(legacyContent, pageSlug, layoutIndex);
  }, [legacyContent]);

  const getPageTemplates = useCallback((pageSlug: string, templateType: string): ContentTemplate[] => {
    return queries.getPageTemplates(legacyContent, pageSlug, templateType);
  }, [legacyContent]);

  const getGlobalComponent = useCallback((componentType: string): GlobalComponent | undefined => {
    return queries.getGlobalComponent(legacyContent, componentType);
  }, [legacyContent]);

  const getTemplateBlocks = useCallback((template: ContentTemplate | GlobalComponent | undefined, patternType?: string): ContentBlock[] => {
    return queries.getTemplateBlocks(template, patternType);
  }, []);

  const getAllBlocks = useCallback((template: ContentTemplate | GlobalComponent | undefined): ContentBlock[] => {
    return queries.getAllBlocks(template);
  }, []);

  return {
    getPageTemplate,
    getPageTemplateByLayoutIndex,
    getPageTemplates,
    getGlobalComponent,
    getTemplateBlocks,
    getAllBlocks
  };
} 