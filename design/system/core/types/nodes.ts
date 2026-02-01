import { SectionType } from '../render/validation/sections';
import { LayoutConfig } from './layout';
import { AnimationConfig } from '../../components/animations/types';
import { BackgroundProps } from '../../components/backgrounds/types';

/**
 * Base interface som alla noder delar
 * Endast gemensamma properties
 */
export interface BaseNode<T extends string = string> {
  type: T;
  props?: Record<string, any>;
}

/**
 * Component - Leaf node, ingen barn
 * Atomic UI element som inte innehåller andra noder
 */
export interface ComponentNode extends BaseNode {
  props: Record<string, any>;
  animation?: AnimationConfig;
  componentKey?: string;
}

/**
 * Pattern - Container för components
 * Innehåller bara components, inte andra patterns
 */
export interface PatternNode extends BaseNode {
  components: Record<string, ComponentNode>;
  layout?: Record<string, any>; // Universal layout system (free-form, validated at runtime)
  order: string[];
  animation?: AnimationConfig;
  patternKey?: string;
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
  header?: SectionHeader;
  patterns?: Record<string, PatternNode>;
  order?: string[];
  layout?: LayoutConfig; // Section layout (split columns, alignment)
  animation?: AnimationConfig;
  sectionKey?: string;
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
 * Extends BackgroundProps for all background functionality
 */
export interface PageProps extends BackgroundProps {
  /** Make sections transparent to show page background through (defaults to true when background is set) */
  transparentSections?: boolean;
  /** Show edge fade/blur effect */
  edgeBlur?: boolean;
  /** Position of the edge effect ('bottom' | 'top', default: 'bottom') */
  edgeBlurPosition?: 'bottom' | 'top';
  /** Mode: 'fade' (soft gradient), 'blur' (backdrop), 'both' (default: 'fade') */
  edgeBlurMode?: 'fade' | 'blur' | 'both';
  /** Height of the effect in pixels (default: 60) */
  edgeBlurHeight?: number;
  /** Blur intensity in pixels - for 'blur' or 'both' mode (default: 8) */
  edgeBlurAmount?: number;
  /** Opacity of fade effect (0-1, default: 0.4) */
  edgeBlurOpacity?: number;
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