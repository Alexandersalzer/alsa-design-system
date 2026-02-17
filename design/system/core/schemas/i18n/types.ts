/**
 * Type definitions for schema translations
 * Defines the structure for component, pattern, section, and page translations
 */

/**
 * Translation for a single prop in a schema
 */
export interface PropTranslation {
  /** Display name shown in CMS editor */
  displayName: string;
  
  /** Description/help text */
  description?: string;
  
  /** Placeholder text for input fields */
  placeholder?: string;
  
  /** Hint text shown in editor */
  editorHint?: string;
  
  /** Example values */
  examples?: string[];
  
  /** Labels for enum values */
  valueLabels?: Record<string, string>;
  
  /** Label for true state (boolean props) */
  trueLabel?: string;
  
  /** Label for false state (boolean props) */
  falseLabel?: string;
}

/**
 * Translation for a validation rule
 */
export interface ValidationTranslation {
  /** Validation error/warning message */
  message: string;
}

/**
 * Translation for a usage example
 */
export interface ExampleTranslation {
  /** Example name */
  name: string;
  
  /** Example description */
  description?: string;
  
  /** Example category */
  category?: string;
}

/**
 * Translation for a component schema
 */
export interface ComponentTranslation {
  /** Component display name in CMS */
  displayName: string;
  
  /** Component description */
  description?: string;
  
  /** Default content value (language-specific) */
  defaultContent?: string;
  
  /** Translations for all props */
  props?: Record<string, PropTranslation>;
  
  /** Translations for validation messages */
  validation?: Record<string, string>;
  
  /** Translations for examples */
  examples?: Record<string, ExampleTranslation>;
}

/**
 * Translation for a pattern schema
 */
export interface PatternTranslation {
  displayName: string;
  description?: string;
  props?: Record<string, PropTranslation>;
  validation?: Record<string, string>;
  examples?: Record<string, ExampleTranslation>;
}

/**
 * Translation for a section schema
 */
export interface SectionTranslation {
  displayName: string;
  description?: string;
  props?: Record<string, PropTranslation>;
  validation?: Record<string, string>;
  examples?: Record<string, ExampleTranslation>;
}

/**
 * Translation for a page schema
 */
export interface PageTranslation {
  displayName: string;
  description?: string;
  props?: Record<string, PropTranslation>;
  validation?: Record<string, string>;
  examples?: Record<string, ExampleTranslation>;
}

/**
 * Supported locales
 */
export type SupportedLocale = 'sv' | 'en' | 'de' | 'es' | 'fr' | 'no' | 'da' | 'fi';

/**
 * Type for translation dictionaries
 */
export type TranslationDictionary<T> = {
  [K in SupportedLocale]?: T;
};
