import { SectionType } from '../rendering/schemas/sections';

/**
 * Base interface som alla noder delar
 * Endast gemensamma properties
 */
export interface BaseNode<T extends string = string> {
  type: T;
  props?: Record<string, any>; // Optional eftersom alla kanske inte har props
}

/**
 * Component - Leaf node, ingen barn
 * Atomic UI element som inte innehåller andra noder
 */
export interface ComponentNode extends BaseNode {
  role?: string; // Optional role for semantic identification
}

/**
 * Pattern - Container för components
 * Innehåller bara components, inte andra patterns
 */
export interface PatternNode extends BaseNode {
  components: Record<string, ComponentNode>; // Required - pattern måste ha components
}


/**
 * Section - Container för patterns  
 * Top-level containers som organiserar patterns
 */
export interface SectionNode extends BaseNode<SectionType> {
  patterns: Record<string, PatternNode>; // Required - section måste ha patterns
  order: string[]; // Required - sections behöver rendering order
}

/**
 * Page - Complete page structure
 */
export interface PageNode {
  name: string;
  language: string;
  sections: Record<string, SectionNode>;
  order: string[];
  props: Record<string, any>;
}