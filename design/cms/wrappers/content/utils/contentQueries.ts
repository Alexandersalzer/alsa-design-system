import { WebsiteContent, LanguageContent, ContentTemplate, ContentBlock, GlobalComponent } from '../types/content';

/**
 * Get a specific template from a page by type and index
 */
export function getPageTemplate(
  content: LanguageContent | null, 
  pageSlug: string, 
  templateType: string,
  templateIndex: number = 0
): ContentTemplate | undefined {
  if (!content?.pages || !content.pages[pageSlug]) {
    return undefined;
  }

  const page = content.pages[pageSlug];
  const templatesOfType = page.templates.filter(template => template.type === templateType);
  
  return templatesOfType[templateIndex];
}

/**
 * Get all templates of a specific type from a page
 */
export function getPageTemplates(
  content: LanguageContent | null, 
  pageSlug: string, 
  templateType: string
): ContentTemplate[] {
  if (!content?.pages || !content.pages[pageSlug]) {
    return [];
  }

  const page = content.pages[pageSlug];
  return page.templates.filter(template => template.type === templateType);
}

/**
 * Get a global component by type
 */
export function getGlobalComponent(
  content: LanguageContent | null, 
  componentType: string
): GlobalComponent | undefined {
  if (!content?.globals) {
    return undefined;
  }

  return content.globals[componentType];
}

/**
 * Get all blocks from a template, optionally filtered by pattern type
 */
export function getTemplateBlocks(
  template: ContentTemplate | GlobalComponent | undefined,
  patternType?: string
): ContentBlock[] {
  if (!template?.patterns) {
    return [];
  }

  const patterns = patternType 
    ? template.patterns.filter(pattern => pattern.type === patternType)
    : template.patterns;

  return patterns.flatMap(pattern => pattern.blocks || []);
}

/**
 * Get all blocks from a template (all patterns)
 */
export function getAllBlocks(
  template: ContentTemplate | GlobalComponent | undefined
): ContentBlock[] {
  return getTemplateBlocks(template);
}

/**
 * Pure function to filter blocks by type
 */
export function getBlocksByType(blocks: ContentBlock[], blockType: string): ContentBlock[] {
  const filteredBlocks = blocks.filter(block => block.type === blockType);
  return filteredBlocks;
}

/**
 * Pure function to get content from the first block of a specific type
 */
export function getBlockContent(blocks: ContentBlock[], blockType: string): string | undefined {
  const block = blocks.find(block => block.type === blockType);
  const content = block?.content;
  return content;
}

/**
 * Pure function to get config from the first block of a specific type
 */
export function getBlockConfig(blocks: ContentBlock[], blockType: string): any {
  const block = blocks.find(block => block.type === blockType);
  const config = block?.config;
  return config;
} 