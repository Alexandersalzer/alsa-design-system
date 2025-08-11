import { WebsiteContent, ContentBlock, ContentTemplate, GlobalComponent } from '../types/content';

/**
 * Pure function to get a specific template from a page by type and index
 */
export function getPageTemplate(
  content: WebsiteContent | null, 
  pageSlug: string, 
  templateType: string,
  templateIndex: number = 0
): ContentTemplate | undefined {
  if (!content?.pages) return undefined;

  // Find the page by slug
  const page = Object.values(content.pages).find((p: any) => p.slug === pageSlug);
  if (!page?.templates) return undefined;

  // Find all templates of this type
  const templatesOfType = page.templates.filter((template: any) => template.type === templateType);
  
  // Return the template at the specified index
  return templatesOfType[templateIndex];
}

/**
 * Pure function to get ALL templates of a specific type from a page
 */
export function getPageTemplates(
  content: WebsiteContent | null, 
  pageSlug: string, 
  templateType: string
): ContentTemplate[] {
  if (!content?.pages) return [];

  // Find the page by slug
  const page = Object.values(content.pages).find((p: any) => p.slug === pageSlug);
  if (!page?.templates) return [];

  // Find all templates of this type
  const templatesOfType = page.templates.filter((template: any) => template.type === templateType);
  return templatesOfType;
}

/**
 * Pure function to get a global component
 */
export function getGlobalComponent(
  content: WebsiteContent | null, 
  componentType: string
): GlobalComponent | undefined {
  if (!content?.globals) return undefined;

  const component = content.globals[componentType];
  return component;
}

/**
 * Pure function to get blocks from a template or global component
 */
export function getTemplateBlocks(
  template: ContentTemplate | GlobalComponent | undefined, 
  patternType?: string
): ContentBlock[] {
  if (!template?.patterns) return [];

  // If patternType is specified, find that specific pattern
  if (patternType) {
    const pattern = template.patterns.find(p => p.type === patternType);
    return pattern?.blocks || [];
  }

  // Otherwise, return blocks from the first pattern (default behavior)
  const firstPattern = template.patterns[0];
  return firstPattern?.blocks || [];
}

/**
 * Pure function to get all blocks from all patterns in a template
 */
export function getAllBlocks(template: ContentTemplate | GlobalComponent | undefined): ContentBlock[] {
  if (!template?.patterns) return [];

  // Flatten all blocks from all patterns
  const allBlocks = template.patterns.reduce((acc: ContentBlock[], pattern) => {
    if (pattern.blocks) {
      acc.push(...pattern.blocks);
    }
    return acc;
  }, []);

  return allBlocks;
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