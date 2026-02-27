/**
 * Shared Schema Type Definitions
 * 
 * Common types and utilities used across all schema types.
 * Single source of truth for validation, migration, and common patterns.
 */

// ============================================
// VALIDATION TYPES
// ============================================

/**
 * Validation severity levels
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';

/**
 * Conditional operators for visibility/validation rules
 */
export type ConditionalOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'notContains'
  | 'exists' 
  | 'notExists'
  | 'greaterThan' 
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'isEmpty'
  | 'isNotEmpty';

/**
 * Conditional rule for prop visibility or validation
 */
export interface ConditionalRule {
  /** Property path to check (supports dot notation) */
  property: string;
  
  /** Comparison operator */
  operator: ConditionalOperator;
  
  /** Value to compare against (optional for exists/isEmpty operators) */
  value?: any;
  
  /** Combine multiple conditions with AND */
  and?: ConditionalRule[];
  
  /** Combine multiple conditions with OR */
  or?: ConditionalRule[];
}

/**
 * Context provided to validators
 */
export interface ValidationContext {
  /** Component/pattern/section/page type being validated */
  componentType?: string;
  patternType?: string;
  sectionType?: string;
  pageType?: string;
  
  /** Parent pattern key (if applicable) */
  patternKey?: string;
  
  /** Parent section key (if applicable) */
  sectionKey?: string;
  
  /** Current locale */
  locale?: string;
}

/**
 * Validator function type
 */
export type ValidatorFunction = (
  value: any, 
  allProps: Record<string, any>,
  context?: ValidationContext
) => boolean;

/**
 * Validation rule for prop value checking
 */
export interface ValidationRule {
  /** Unique rule identifier */
  id: string;
  
  /** Error/warning message to display */
  message: string;
  
  /** Validation function or expression */
  validator: string | ValidatorFunction;
  
  /** Severity level */
  severity?: ValidationSeverity;
  
  /** Only run validation if condition is met */
  condition?: ConditionalRule;
}

/**
 * Validation error
 */
export interface ValidationError {
  /** Property path that failed validation */
  property: string;
  
  /** Error message */
  message: string;
  
  /** Rule that failed */
  ruleId?: string;
  
  /** Current value that failed */
  value?: any;
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  /** Property path */
  property: string;
  
  /** Warning message */
  message: string;
  
  /** Rule that triggered warning */
  ruleId?: string;
}

/**
 * Schema validation result
 */
export interface SchemaValidationResult {
  /** Whether validation passed */
  valid: boolean;
  
  /** Error messages */
  errors: ValidationError[];
  
  /** Warning messages */
  warnings: ValidationWarning[];
  
  /** Info messages */
  info?: string[];
}

// ============================================
// MIGRATION TYPES
// ============================================

/**
 * Migration transform function
 */
export type MigrationTransform = (
  oldProps: Record<string, any>
) => Record<string, any>;

/**
 * Migration definition for schema changes
 */
export interface SchemaMigration {
  /** Version this migration applies from */
  from: string;
  
  /** Version this migration applies to */
  to: string;
  
  /** Description of changes */
  description: string;
  
  /** Transform function or expression */
  transform: string | MigrationTransform;
  
  /** Whether this is a breaking change */
  breaking?: boolean;
}

/**
 * Deprecation info
 */
export interface DeprecationInfo {
  /** Version when deprecated */
  since: string;
  
  /** Deprecation message */
  message: string;
  
  /** Replacement identifier */
  replacement?: string;
}

// ============================================
// EDITOR TYPES
// ============================================

/**
 * Editor types for CMS rendering
 */
export type EditorType = 
  // String editors
  | 'text' | 'textarea' | 'richtext' | 'url' | 'email' | 'color' | 'code'
  // Number editors
  | 'number' | 'slider' | 'stepper'
  // Boolean editors
  | 'toggle' | 'checkbox' | 'switch'
  // Enum editors
  | 'select' | 'radio' | 'segmented' | 'buttonGroup' | 'dropdown'
  // Object/Complex editors
  | 'group' | 'modal' | 'builder' | 'action-builder' | 'json' | 'media'
  // Array editors
  | 'list' | 'tags' | 'multiselect' | 'repeater';

// ============================================
// COMMON PROP CONFIG TYPES
// ============================================

/**
 * Base configuration for all prop types
 * Contains common fields shared across all property types
 */
export interface BasePropConfig {
  /** Property name/key (matches JSON key) */
  name: string;
  
  /** Display name shown in editor (human-readable) */
  displayName: string;
  
  /** Detailed description for documentation and tooltips */
  description?: string;
  
  /** Whether this prop is required */
  required?: boolean;
  
  /** Default value if prop is not provided */
  default?: any;
  
  /** Hint text shown in editor to guide users */
  editorHint?: string;
  
  /** Group this prop belongs to (for organizing in editor) */
  group?: string;
  
  /** Conditional visibility rule */
  visibleWhen?: ConditionalRule;
  
  /** Whether this prop can be edited in CMS */
  editable?: boolean;
  
  /** Whether this prop should be shown in CMS editor (default: false) */
  cmsEnabled?: boolean;
  
  /** Mark as deprecated */
  deprecated?: DeprecationInfo;
}

/**
 * Visual preview for enum values
 */
export interface ValuePreview {
  /** Preview type */
  type: 'color' | 'icon' | 'image' | 'gradient';
  
  /** Preview value (hex color, icon name, image URL, etc) */
  value: string;
}

/**
 * String property configuration
 * For text-based props: content, href, alt, etc.
 */
export interface StringPropConfig extends BasePropConfig {
  type: 'string';
  editorType?: 'text' | 'textarea' | 'richtext' | 'url' | 'email' | 'color' | 'code';
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  placeholder?: string;
  examples?: string[];
  supportsFormatting?: boolean;
  allowedFormattingTags?: string[];
}

/**
 * Number property configuration
 * For numeric props: size, opacity, delay, etc.
 */
export interface NumberPropConfig extends BasePropConfig {
  type: 'number';
  editorType?: 'number' | 'slider' | 'stepper';
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  allowDecimal?: boolean;
  suggestions?: number[];
}

/**
 * Boolean property configuration
 * For true/false props: hidden, disabled, fullWidth, etc.
 */
export interface BooleanPropConfig extends BasePropConfig {
  type: 'boolean';
  editorType?: 'toggle' | 'checkbox' | 'switch';
  trueLabel?: string;
  falseLabel?: string;
}

/**
 * Enum property configuration
 * For props with predefined values: variant, size, align, etc.
 */
export interface EnumPropConfig extends BasePropConfig {
  type: 'enum';
  editorType?: 'select' | 'radio' | 'segmented' | 'buttonGroup' | 'dropdown';
  values: readonly string[];
  valueLabels?: Record<string, string>;
  valuePreviews?: Record<string, ValuePreview>;
  valueGroups?: Record<string, string[]>;
}

/**
 * Object property configuration
 * For nested/complex props: action, animation, layout, etc.
 */
export interface ObjectPropConfig extends BasePropConfig {
  type: 'object';
  editorType?: 'group' | 'modal' | 'builder' | 'action-builder' | 'json';
  $ref?: string;
  properties?: Record<string, PropConfig>;
  requiredProperties?: string[];
  additionalProperties?: boolean;
}

/**
 * Array property configuration
 * For list props: items, options, badges, etc.
 */
export interface ArrayPropConfig extends BasePropConfig {
  type: 'array';
  editorType?: 'list' | 'tags' | 'multiselect' | 'repeater';
  items: PropConfig;
  minItems?: number;
  maxItems?: number;
  sortable?: boolean;
  defaultItems?: any[];
}

/**
 * Union type for all prop configurations
 * This is the main type used in schema definitions
 */
export type PropConfig = 
  | StringPropConfig 
  | NumberPropConfig 
  | BooleanPropConfig 
  | EnumPropConfig 
  | ObjectPropConfig 
  | ArrayPropConfig;

// ============================================
// USAGE EXAMPLE TYPES
// ============================================

/**
 * Base interface for all examples
 */
export interface BaseExample {
  /** Example name */
  name: string;
  
  /** Description of the example */
  description?: string;
  
  /** Category/use case */
  category?: string;
  
  /** Visual preview (screenshot URL) */
  preview?: string;
}
