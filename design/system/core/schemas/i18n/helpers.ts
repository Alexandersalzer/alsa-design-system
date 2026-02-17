/**
 * Helper functions for working with schema translations
 */

import type { 
  ComponentTranslation, 
  PropTranslation,
  SupportedLocale,
  TranslationDictionary 
} from './types';

/**
 * Get translation for a specific locale with fallback
 * @param translations - Dictionary of translations by locale
 * @param locale - Requested locale
 * @param fallbackLocale - Fallback locale if requested not found (default: 'sv')
 * @returns Translation object for the locale
 */
export function getTranslation<T>(
  translations: TranslationDictionary<T>,
  locale: string,
  fallbackLocale: SupportedLocale = 'sv'
): T {
  const requestedLocale = locale as SupportedLocale;
  return (
    translations[requestedLocale] || 
    translations[fallbackLocale] || 
    translations.sv ||
    translations.en ||
    Object.values(translations)[0]
  ) as T;
}

/**
 * Merge prop configuration with translation
 * Used to apply language-specific labels to a prop config
 * 
 * @param baseProp - Base prop configuration (type, values, etc)
 * @param translation - Translation for this prop
 * @returns Merged prop configuration
 */
export function createLocalizedProp(
  baseProp: any,
  translation?: PropTranslation
): any {
  if (!translation) return baseProp;
  
  return {
    ...baseProp,
    displayName: translation.displayName ?? baseProp.displayName,
    description: translation.description ?? baseProp.description,
    placeholder: translation.placeholder ?? baseProp.placeholder,
    editorHint: translation.editorHint ?? baseProp.editorHint,
    examples: translation.examples ?? baseProp.examples,
    valueLabels: translation.valueLabels ?? baseProp.valueLabels,
    trueLabel: translation.trueLabel ?? baseProp.trueLabel,
    falseLabel: translation.falseLabel ?? baseProp.falseLabel,
  };
}

/**
 * Create a localized validation rule
 * @param baseRule - Base validation rule
 * @param message - Translated message
 * @returns Validation rule with translated message
 */
export function createLocalizedValidation(
  baseRule: any,
  message?: string
): any {
  if (!message) return baseRule;
  
  return {
    ...baseRule,
    message,
  };
}

/**
 * Create a localized example
 * @param baseExample - Base example data
 * @param translation - Translated name/description
 * @returns Example with translated metadata
 */
export function createLocalizedExample(
  baseExample: any,
  translation?: { name?: string; description?: string; category?: string }
): any {
  if (!translation) return baseExample;
  
  return {
    ...baseExample,
    name: translation.name ?? baseExample.name,
    description: translation.description ?? baseExample.description,
    category: translation.category ?? baseExample.category,
  };
}

/**
 * Validate that all required translation keys exist
 * Useful for development to ensure translations are complete
 * 
 * @param translation - Translation object to validate
 * @param requiredKeys - Array of required keys
 * @returns Array of missing keys (empty if valid)
 */
export function validateTranslation(
  translation: any,
  requiredKeys: string[]
): string[] {
  const missing: string[] = [];
  
  for (const key of requiredKeys) {
    if (!(key in translation)) {
      missing.push(key);
    }
  }
  
  return missing;
}

/**
 * Deep merge two translation objects
 * Used when you want to extend a base translation with overrides
 * 
 * @param base - Base translation object
 * @param override - Override translation object
 * @returns Merged translation
 */
export function mergeTranslations<T>(base: T, override: Partial<T>): T {
  return {
    ...base,
    ...override,
    props: {
      ...(base as any).props,
      ...(override as any).props,
    },
    validation: {
      ...(base as any).validation,
      ...(override as any).validation,
    },
    examples: {
      ...(base as any).examples,
      ...(override as any).examples,
    },
  };
}
