import { SectionType } from '../render/validation/sections';

/**
 * Base interface som alla noder delar
 * Endast gemensamma properties
 */
export interface BaseNode<T extends string = string> {
  type: T;
  props: Record<string, any>; // Optional eftersom alla kanske inte har props
}

/**
 * Component - Leaf node, ingen barn
 * Atomic UI element som inte innehåller andra noder
 */
export interface ComponentNode extends BaseNode {
  props: Record<string, any>; // Required - component måste ha props
  componentKey?: string; // För live editing identification
}

/**
 * Pattern - Container för components
 * Innehåller bara components, inte andra patterns
 */
export interface PatternNode extends BaseNode {
  components: Record<string, ComponentNode>; // Required - pattern måste ha components
  order: string[]; // Required - patterns behöver rendering order för components
  patternKey?: string; // För live editing identification
}


/**
 * Section Header - Optional header with tag, heading, body components
 */
export interface SectionHeader {
  components: Record<string, ComponentNode>;
}

/**
 * Section Layout Configuration
 */
export interface SectionLayout {
  slots?: {
    left?: string[];
    right?: string[];
    bottom?: string[];
  };
  grid?: {
    areas: string[][];
    columns?: string;
    gap?: 'md' | 'lg' | 'xl';
    slots?: Record<string, string[]>;
  };
  gap?: 'md' | 'lg' | 'xl';
}

/**
 * Section - Container för patterns  
 * Top-level containers som organiserar patterns
 */
export interface SectionNode extends BaseNode<SectionType> {
  header?: SectionHeader; // Optional - section header med tag, heading, body
  patterns?: Record<string, PatternNode>; // Optional - section kan ha patterns
  order?: string[]; // Optional - sections behöver rendering order för patterns
  layout?: SectionLayout; // Optional - layout configuration for split/grid modes
  sectionKey?: string; // För live editing identification
}

/**
 * SEO metadata for a page
 */
export interface PageSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, any>;
}

/**
 * Page - Complete page structure
 */
export interface PageNode extends BaseNode {
  name: string;
  locale: string;
  seo?: PageSEO;
  sections: Record<string, SectionNode>;
  order: string[];
}