import { WebsiteContent, ContentBlock, ContentTemplate, GlobalComponent } from '../types/content';

export function useContentQueries(content: WebsiteContent | null) {
  // Get page content by slug
  const getPageContent = (pageSlug: string) => {
    if (!content?.pages) return null;
    return content.pages[pageSlug];
  };

  // Get global component by type
  const getGlobalComponent = (componentType: string) => {
    if (!content?.globals) return null;
    return content.globals[componentType];
  };

  // Get page template by type and optional index
  const getPageTemplate = (pageSlug: string, templateType: string, templateIndex: number = 0) => {
    const page = getPageContent(pageSlug);
    if (!page?.templates) return null;
    
    const matchingTemplates = page.templates.filter(t => t.type === templateType);
    return matchingTemplates[templateIndex];
  };

  // Get all page templates of a specific type
  const getPageTemplates = (pageSlug: string, templateType: string) => {
    const page = getPageContent(pageSlug);
    if (!page?.templates) return [];
    
    return page.templates.filter(t => t.type === templateType);
  };

  // Get template pattern by type and optional index
  const getTemplatePattern = (template: any, patternType: string, patternIndex: number = 0) => {
    if (!template?.patterns) return null;
    
    const matchingPatterns = template.patterns.filter((p: any) => p.type === patternType);
    return matchingPatterns[patternIndex];
  };

  // Get all template patterns of a specific type
  const getTemplatePatterns = (template: any, patternType: string) => {
    if (!template?.patterns) return [];
    
    return template.patterns.filter((p: any) => p.type === patternType);
  };

  // Get all blocks from a template and pattern type
  const getTemplateBlocks = (template: any, patternType: string) => {
    const patterns = getTemplatePatterns(template, patternType);
    return patterns.reduce((blocks: any[], pattern: any) => {
      return blocks.concat(pattern.blocks || []);
    }, []);
  };

  // Get all blocks from a pattern
  const getPatternBlocks = (pattern: any) => {
    if (!pattern?.blocks) return [];
    return pattern.blocks;
  };

  return {
    getPageContent,
    getGlobalComponent,
    getPageTemplate,
    getPageTemplates,
    getTemplatePattern,
    getTemplatePatterns,
    getTemplateBlocks,
    getPatternBlocks
  };
} 