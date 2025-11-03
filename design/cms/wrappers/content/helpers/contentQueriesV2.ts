/**
 * Helper functions for querying the new nested content structure (V2)
 * Used for hem.json format with sections -> patterns -> components
 */

import { 
  ContentPageV2, 
  ContentSection, 
  ContentPatternV2, 
  ContentComponent,
  ContentButtonContent,
  WebsiteContentV2 
} from '../types/content';

/**
 * Type guard to check if content is V2 format
 */
export function isContentV2(page: any): page is ContentPageV2 {
  return page && typeof page === 'object' && 'sections' in page && 'order' in page;
}

/**
 * Get a specific section from a page by section type and index
 */
export function getSection(
  page: ContentPageV2 | null | undefined,
  sectionType: string,
  index: number = 0
): ContentSection | null {
  if (!page || !page.sections || !page.order) return null;

  // Find all sections of the specified type
  const matchingSections = page.order
    .map(sectionId => page.sections[sectionId])
    .filter(section => section && section.type === sectionType);

  // Return the section at the specified index
  return matchingSections[index] || null;
}

/**
 * Get a specific pattern from a section by pattern type and index
 */
export function getPattern(
  section: ContentSection | null | undefined,
  patternType: string,
  index: number = 0
): ContentPatternV2 | null {
  if (!section || !section.patterns || !section.order) return null;

  // Find all patterns of the specified type
  const matchingPatterns = section.order
    .map(patternId => section.patterns[patternId])
    .filter(pattern => pattern && pattern.type === patternType);

  // Return the pattern at the specified index
  return matchingPatterns[index] || null;
}

/**
 * Get a specific component from a pattern by component type
 */
export function getComponent(
  pattern: ContentPatternV2 | null | undefined,
  componentType: string
): ContentComponent | null {
  if (!pattern || !pattern.components) return null;

  // Find the first component of the specified type
  const componentEntry = Object.entries(pattern.components).find(
    ([, component]) => component.type === componentType
  );

  return componentEntry ? componentEntry[1] : null;
}

/**
 * Get content string from a component
 */
export function getComponentContent(component: ContentComponent | null | undefined): string {
  if (!component) return '';
  
  if (typeof component.content === 'string') {
    return component.content;
  }
  
  // Handle button content structure
  if (component.content && typeof component.content === 'object' && 'content' in component.content) {
    return (component.content as ContentButtonContent).content;
  }
  
  return '';
}

/**
 * Get all components of a specific type from a pattern
 */
export function getAllComponents(
  pattern: ContentPatternV2 | null | undefined,
  componentType?: string
): ContentComponent[] {
  if (!pattern || !pattern.components) return [];

  const components = Object.values(pattern.components);
  
  if (componentType) {
    return components.filter(c => c.type === componentType);
  }
  
  return components;
}

/**
 * Shortcut: Get section -> pattern -> component content in one call
 */
export function getSectionContent(
  page: ContentPageV2 | null | undefined,
  sectionType: string,
  patternType: string,
  componentType: string,
  sectionIndex: number = 0,
  patternIndex: number = 0
): string {
  const section = getSection(page, sectionType, sectionIndex);
  const pattern = getPattern(section, patternType, patternIndex);
  const component = getComponent(pattern, componentType);
  return getComponentContent(component);
}

/**
 * Get pattern settings
 */
export function getPatternSettings(
  pattern: ContentPatternV2 | null | undefined
): Record<string, any> {
  return pattern?.settings || {};
}

/**
 * Get component settings
 */
export function getComponentSettings(
  component: ContentComponent | null | undefined
): Record<string, any> {
  return component?.settings || {};
}

