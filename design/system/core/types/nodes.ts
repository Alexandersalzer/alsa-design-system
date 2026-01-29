import { SectionType } from '../render/validation/sections';
import { LayoutConfig } from '../layout/types';
import { AnimationConfig } from '../animations/types';

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
 */
export interface PageProps {
  /** Background type: 'default' | 'generative' | 'gradient' | 'pattern' | 'video' | 'image' */
  background?: 'default' | 'generative' | 'gradient' | 'pattern' | 'video' | 'image';
  
  // Image background props (legacy support)
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
  
  // Generative background props
  generativeVariant?: 'subtle' | 'medium' | 'vibrant';
  generativeColorScheme?: 'accent' | 'primary' | 'success' | 'warning' | 'info';
  generativeSeed?: number;
  generativeIntensity?: number;
  generativeBlur?: number;
  generativeFadeEdge?: 'top' | 'bottom' | 'both' | 'none';
  generativeFadeStrength?: number;
  
  // Gradient background props
  gradientType?: 'mesh' | 'radial' | 'conic' | 'linear';
  gradientColorScheme?: 'accent' | 'primary' | 'success' | 'warning' | 'info';
  gradientAnimated?: boolean;
  gradientIntensity?: number;
  gradientFadeEdge?: 'top' | 'bottom' | 'both' | 'none';
  gradientFadeStrength?: number;
  
  // Pattern background props
  patternType?: 'dots' | 'lines' | 'grid' | 'diagonal' | 'hexagon';
  patternColorScheme?: 'accent' | 'primary' | 'success' | 'warning' | 'info' | 'neutral';
  patternDensity?: 'sparse' | 'normal' | 'dense';
  patternAnimated?: boolean;
  patternOpacity?: number;
  patternFadeEdge?: 'top' | 'bottom' | 'both' | 'none';
  patternFadeStrength?: number;
  
  // Video background props
  videoSrc?: string;
  videoPoster?: string;
  videoFit?: 'cover' | 'contain' | 'fill';
  videoOverlayType?: 'none' | 'dark' | 'light' | 'gradient';
  videoOverlayOpacity?: number;
  videoPlaybackRate?: number;
  videoFadeEdge?: 'top' | 'bottom' | 'both' | 'none';
  videoFadeStrength?: number;
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