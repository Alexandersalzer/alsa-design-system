/**
 * Component Schema Registry
 * 
 * Central registry for all component schemas.
 * Maps component type strings to their schema definitions.
 * Supports runtime locale switching for language-specific defaults and labels.
 * 
 * Usage:
 * ```typescript
 * import { componentSchemas, getComponentSchema, setSchemaLocale } from './schemaRegistry';
 * 
 * // Change locale (will regenerate all schemas)
 * setSchemaLocale('en');
 * 
 * // Get schema for current locale
 * const schema = getComponentSchema('button');
 * const defaultProps = schema?.defaultProps; // Language-specific defaults
 * ```
 */

import { ComponentSchema } from '../core/schemas/component.types';
import type { SupportedLocale } from '../core/schemas/i18n/types';
import { 
  getSchemaLocale as getCoreSchemaLocale,
  setSchemaLocale as setCoreSchemaLocale,
  onLocaleChange 
} from '../core/schemas/i18n';

// Actions
import { createButtonSchema } from './actions/Button/schema';
import { createIconButtonSchema } from './actions/IconButton/schema';
import { createTextLinkSchema } from './actions/TextLink/schema';
import { createClickableSchema } from './actions/Clickable/schema';
import { createSegmentedControlSchema } from './actions/SegmentedControl/schema';
import { createSelectionCardSchema } from './actions/SelectionCard/schema';
import { createBulkActionBarSchema } from './actions/BulkActionBar/schema';
import { createKbdSchema } from './actions/Kbd/schema';
import { createSocialLinkButtonSchema } from './actions/SocialLinkButton/schema';

// Forms
import { createInputSchema } from './forms/Input/schema';
import { createTextareaSchema } from './forms/Textarea/schema';
import { createPickerSchema } from './forms/Picker/schema';
import { createCheckboxSchema } from './forms/Checkbox/schema';
import { createRadioSchema } from './forms/Radio/schema';
import { createSwitchSchema } from './forms/Switch/schema';
import { createSliderSchema } from './forms/Slider/schema';

// Media
import { createImageSchema } from './media/Image/schema';
import { createVideoShowcaseSchema } from './media/VideoShowcase/schema';
import { createAvatarSchema } from './media/Avatar/schema';
import { createLogotextSchema } from './media/Logo/schema';
// Patterns (portfolio används i karusell/grid)
import { createPortfolioSchema } from '../patterns/cards/PortfolioCard/schema';

// Typography
import { createHeadingSchema } from './Typography/headingSchema';
import { createDisplaySchema } from './Typography/displaySchema';
import { createBodySchema } from './Typography/bodySchema';
import { createLabelSchema } from './Typography/labelSchema';
import { createCodeSchema } from './Typography/codeSchema';

// Animations
import { createCountUpSchema } from './animations/CountUp/schema';

// Layout
import { createCardSchema } from './layout/Card/schema';
import { createHStackSchema } from './layout/hStack/schema';
import { createVStackSchema } from './layout/vStack/schema';
import { createGridSchema } from './layout/grid/schema';
import { createSpacerSchema } from './layout/Spacer/schema';
import { createBoxSchema } from './layout/box/schema';
import { createDividerSchema } from './layout/divider/schema';
import { createAccordionSchema, createAccordionItemSchema } from './layout/Accordion/schema';
import { createBleedSchema } from './layout/bleed/schema';
import { createRhythmSchema } from './layout/rhythm/schema';
import { createBentoGridSchema } from './layout/BentoGrid/schema';
import { createMasonryGridSchema } from './layout/MasonryGrid/schema';
import { createStickySchema } from './layout/Sticky/schema';

// Feedback
import { createBadgeSchema } from './feedback/Badge/schema';
import { createTagSchema } from './feedback/Tag/schema';
import { createNumberDisplaySchema } from './feedback/NumberDisplay/schema';

/**
 * Schema factory functions
 * Maps component type to its schema creation function
 */
const schemaFactories: Record<string, (locale: SupportedLocale) => ComponentSchema> = {
  // Actions
  button: createButtonSchema,
  iconButton: createIconButtonSchema,
  link: createTextLinkSchema,
  clickable: createClickableSchema,
  segmentedControl: createSegmentedControlSchema,
  selectionCard: createSelectionCardSchema,
  bulkActionBar: createBulkActionBarSchema,
  kbd: createKbdSchema,
  socialLinkButton: createSocialLinkButtonSchema,

  // Forms
  input: createInputSchema,
  textarea: createTextareaSchema,
  picker: createPickerSchema,
  checkbox: createCheckboxSchema,
  radio: createRadioSchema,
  switch: createSwitchSchema,
  slider: createSliderSchema,
  
  // Media
  image: createImageSchema,
  videoShowcase: createVideoShowcaseSchema,
  avatar: createAvatarSchema,
  logotext: createLogotextSchema,
  portfolio: createPortfolioSchema,
  
  // Typography
  heading: createHeadingSchema,
  display: createDisplaySchema,
  body: createBodySchema,
  label: createLabelSchema,
  code: createCodeSchema,
  
  // Animations
  countup: createCountUpSchema,
  
  // Layout
  card: createCardSchema,
  hStack: createHStackSchema,
  vStack: createVStackSchema,
  grid: createGridSchema,
  spacer: createSpacerSchema,
  box: createBoxSchema,
  divider: createDividerSchema,
  accordion: createAccordionSchema,
  accordionItem: createAccordionItemSchema,
  bleed: createBleedSchema,
  rhythm: createRhythmSchema,
  bentoGrid: createBentoGridSchema,
  masonryGrid: createMasonryGridSchema,
  sticky: createStickySchema,
  
  // Feedback
  badge: createBadgeSchema,
  tag: createTagSchema,
  numberDisplay: createNumberDisplaySchema,
};

/**
 * Cached schemas for current locale
 * Regenerated when locale changes
 */
let cachedSchemas: Record<string, ComponentSchema> = {};

/**
 * Generate all schemas for current locale
 */
function regenerateSchemas(): void {
  const locale = getCoreSchemaLocale();
  cachedSchemas = {};
  
  for (const [type, factory] of Object.entries(schemaFactories)) {
    try {
      cachedSchemas[type] = factory(locale);
    } catch (error) {
      console.error(`Failed to generate schema for ${type}:`, error);
    }
  }
}

// Initialize schemas with default locale
regenerateSchemas();

// Listen for locale changes and regenerate schemas
onLocaleChange(() => {
  regenerateSchemas();
});

/**
 * Component schemas registry (dynamic proxy)
 * Automatically returns cached schema for current locale
 */
export const componentSchemas = new Proxy({} as Record<string, ComponentSchema>, {
  get(target, prop: string) {
    return cachedSchemas[prop];
  },
  
  // Support Object.keys(), Object.values(), etc.
  ownKeys() {
    return Object.keys(cachedSchemas);
  },
  
  getOwnPropertyDescriptor(target, prop) {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

/**
 * Get the current schema locale
 * @returns Current locale code (e.g., 'sv', 'en')
 */
export function getSchemaLocale(): SupportedLocale {
  return getCoreSchemaLocale();
}

/**
 * Set the schema locale
 * This will regenerate all schemas with new language-specific defaults and labels
 * 
 * @param locale - New locale code
 * 
 * @example
 * ```typescript
 * // Switch to English
 * setSchemaLocale('en');
 * 
 * // All schemas now have English labels and defaults
 * const button = getComponentSchema('button');
 * console.log(button.defaultProps.content); // "Click here"
 * 
 * // Switch to Swedish
 * setSchemaLocale('sv');
 * console.log(button.defaultProps.content); // "Klicka här"
 * ```
 */
export function setSchemaLocale(locale: SupportedLocale): void {
  setCoreSchemaLocale(locale);
  // Schemas will be regenerated automatically via onLocaleChange listener
}

/**
 * Get schema for a component type
 * @param componentType - The component type (e.g., 'button')
 * @returns The component schema or undefined if not found
 */
export function getComponentSchema(componentType: string): ComponentSchema | undefined {
  return componentSchemas[componentType];
}

/**
 * Get default props from a component schema
 * @param componentType - The component type (e.g., 'button')
 * @returns Default props object or empty object if schema not found
 */
export function getDefaultProps(componentType: string): Record<string, any> {
  const schema = getComponentSchema(componentType);
  return schema?.defaultProps || {};
}

/**
 * Merge default props with provided props
 * @param componentType - The component type
 * @param props - Props from JSON
 * @param locale - Optional locale to use (defaults to global schema locale)
 * @returns Merged props (defaults + provided)
 */
export function mergeWithDefaults(
  componentType: string,
  props: Record<string, any> = {},
  locale?: SupportedLocale
): Record<string, any> {
  // If locale is provided, get defaults for that specific locale
  // Otherwise use the cached schema for current global locale
  let defaults: Record<string, any>;
  
  if (locale) {
    const factory = schemaFactories[componentType];
    if (factory) {
      const schema = factory(locale);
      defaults = schema.defaultProps || {};
    } else {
      defaults = {};
    }
  } else {
    defaults = getDefaultProps(componentType);
  }
  
  const merged = {
    ...defaults,
    ...props, // User props override defaults
  };
  
  return merged;
}

/**
 * Validate component props against schema
 * @param componentType - The component type
 * @param props - Props to validate
 * @returns Validation result
 */
export function validateComponentProps(
  componentType: string,
  props: Record<string, any>
): { valid: boolean; errors: string[]; warnings: string[] } {
  const schema = getComponentSchema(componentType);
  
  if (!schema) {
    return {
      valid: true,
      errors: [],
      warnings: [`No schema found for component type: ${componentType}`],
    };
  }
  
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Check required props
  Object.entries(schema.props).forEach(([propKey, propConfig]) => {
    if (propConfig.required && !(propKey in props)) {
      errors.push(`Missing required prop: ${propKey}`);
    }
  });
  
  // Run validation rules
  if (schema.validation) {
    schema.validation.forEach((rule) => {
      const validator = typeof rule.validator === 'function' 
        ? rule.validator 
        : () => true; // String validators need to be compiled
      
      const isValid = validator(null, props);
      
      if (!isValid) {
        if (rule.severity === 'error') {
          errors.push(rule.message);
        } else if (rule.severity === 'warning') {
          warnings.push(rule.message);
        }
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get all available component types
 */
export function getAvailableComponentTypes(): string[] {
  return Object.keys(componentSchemas);
}

/**
 * Get all schemas for a specific category
 */
export function getSchemasByCategory(category: string): ComponentSchema[] {
  return Object.values(componentSchemas).filter(
    (schema) => schema.category === category
  );
}
