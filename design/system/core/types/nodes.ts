import { SectionType } from '../render/validation/sections';
import { LayoutConfig } from '../layout/types';

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
 * Section - Container för patterns  
 * Top-level containers som organiserar patterns
 */
export interface SectionNode extends BaseNode<SectionType> {
  header?: SectionHeader; // Optional - section header med tag, heading, body
  patterns?: Record<string, PatternNode>; // Optional - section kan ha patterns
  order?: string[]; // Optional - sections behöver rendering order för patterns
  layout?: LayoutConfig; // Optional - layout configuration for section
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
 * Page-level props for styling and configuration
 */
export interface PageProps {
  /** Background image URL */
  backgroundImage?: string;
  /** Background image opacity (0-1), defaults to 0.03 for subtle effect */
  backgroundOpacity?: number;
  /** Background size, defaults to 'auto' for tiled patterns */
  backgroundSize?: 'cover' | 'contain' | 'auto' | string;
  /** Background position, defaults to 'center' */
  backgroundPosition?: string;
  /** Whether background should be fixed on scroll */
  backgroundFixed?: boolean;
  /** Background color (CSS color value, e.g. '#f5f5f5', 'rgb(245,245,245)', 'var(--surface-raised)') */
  backgroundColor?: string;
  /** Color overlay on top of background image (useful for tinting) */
  backgroundOverlay?: string;
  /** Overlay opacity (0-1), defaults to 0.5 */
  backgroundOverlayOpacity?: number;
  /** Make sections transparent to show page background through (defaults to true when background is set) */
  transparentSections?: boolean;
}

/**
 * Page - Complete page structure
 */
export interface PageNode {
  name: string;
  locale: string;
  props?: PageProps;
  seo?: PageSEO;
  sections: Record<string, SectionNode>;
  order: string[];
}