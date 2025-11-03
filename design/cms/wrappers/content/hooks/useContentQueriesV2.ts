/**
 * Hook for V2 content queries (new nested format)
 */

import { 
  AnyWebsiteContent,
  WebsiteContentV2,
  ContentPageV2,
  ContentSection,
  ContentPatternV2,
  ContentComponent
} from '../types/content';
import {
  isContentV2,
  getSection,
  getPattern,
  getComponent,
  getComponentContent,
  getSectionContent
} from '../helpers/contentQueriesV2';

export function useContentQueriesV2(content: AnyWebsiteContent | null) {
  /**
   * Get a page in V2 format
   */
  const getPageV2 = (pageSlug: string): ContentPageV2 | null => {
    if (!content?.pages) return null;

    const page = content.pages[pageSlug];
    
    // Check if it's V2 format
    if (isContentV2(page)) {
      return page;
    }

    return null;
  };

  /**
   * Get a section from a V2 page
   */
  const getSectionV2 = (
    page: ContentPageV2 | null,
    sectionType: string,
    index: number = 0
  ): ContentSection | null => {
    return getSection(page, sectionType, index);
  };

  /**
   * Get a pattern from a section
   */
  const getPatternV2 = (
    section: ContentSection | null,
    patternType: string,
    index: number = 0
  ): ContentPatternV2 | null => {
    return getPattern(section, patternType, index);
  };

  /**
   * Get a component from a pattern
   */
  const getComponentV2 = (
    pattern: ContentPatternV2 | null,
    componentType: string
  ): ContentComponent | null => {
    return getComponent(pattern, componentType);
  };

  /**
   * Get content string from a component
   */
  const getComponentContentV2 = (component: ContentComponent | null): string => {
    return getComponentContent(component);
  };

  /**
   * Shortcut to get content in one call
   */
  const getSectionContentV2 = (
    page: ContentPageV2 | null,
    sectionType: string,
    patternType: string,
    componentType: string,
    sectionIndex: number = 0,
    patternIndex: number = 0
  ): string => {
    return getSectionContent(page, sectionType, patternType, componentType, sectionIndex, patternIndex);
  };

  return {
    getPageV2,
    getSectionV2,
    getPatternV2,
    getComponentV2,
    getComponentContentV2,
    getSectionContentV2
  };
}

