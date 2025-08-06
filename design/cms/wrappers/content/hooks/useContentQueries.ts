import { useCallback } from 'react';
import { type WebsiteContent } from '../../../utils/content';
import { ContentBlock, ContentTemplate, GlobalComponent } from '../types/content';
import * as queries from '../utils/contentQueries';

/**
 * Hook that provides query functions bound to current content
 */
export function useContentQueries(content: WebsiteContent | null) {
  // Bind query functions to current content
  const getPageTemplate = useCallback((pageSlug: string, templateType: string): ContentTemplate | undefined => {
    return queries.getPageTemplate(content, pageSlug, templateType);
  }, [content]);

  const getGlobalComponent = useCallback((componentType: string): GlobalComponent | undefined => {
    return queries.getGlobalComponent(content, componentType);
  }, [content]);

  const getTemplateBlocks = useCallback((template: ContentTemplate | GlobalComponent | undefined, patternType?: string): ContentBlock[] => {
    return queries.getTemplateBlocks(template, patternType);
  }, []);

  const getAllBlocks = useCallback((template: ContentTemplate | GlobalComponent | undefined): ContentBlock[] => {
    return queries.getAllBlocks(template);
  }, []);

  return {
    getPageTemplate,
    getGlobalComponent,
    getTemplateBlocks,
    getAllBlocks
  };
} 