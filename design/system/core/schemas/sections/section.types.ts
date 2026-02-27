/**
 * Section Schema Type Definitions
 * 
 * Defines allowed section types and their validation rules.
 * Used for validating page structure in /public/pages/*.json files.
 */

// ============================================
// ALLOWED SECTION TYPES
// ============================================

/**
 * All allowed section types in Blimpify
 * These are the ONLY section types that can be used in pages
 */
export const AllowedSectionTypes = [
  'hero',
  'about',
  'services',
  'testimonials',
  'faq',
  'pricing',
  'cta',
  'logos',
  'stats',
  'team',
  'process',
  'contact',
  'results'
] as const;

/**
 * Section type union from allowed types
 */
export type SectionType = typeof AllowedSectionTypes[number];

/**
 * Check if a string is a valid section type
 */
export function isValidSectionType(type: string): type is SectionType {
  return AllowedSectionTypes.includes(type as SectionType);
}

// ============================================
// SECTION POSITIONING RULES
// ============================================

/**
 * Section positioning rules for page structure
 */
export const SectionPositioningRules = {
  /** Hero must be first section (if present) */
  heroMustBeFirst: {
    sectionType: 'hero' as const,
    position: 'first' as const,
    required: true,
    message: 'Hero section must be the first section in the page'
  },
  
  /** Contact must be last section (if present) */
  contactMustBeLast: {
    sectionType: 'contact' as const,
    position: 'last' as const,
    required: false,
    message: 'Contact section must be the last section in the page'
  }
} as const;

/**
 * Section occurrence rules
 */
export const SectionOccurrenceRules = {
  /** Maximum one of each section type per page */
  maxOnePerType: {
    rule: 'max-one-per-type' as const,
    message: 'Only one section of each type is allowed per page'
  }
} as const;

/**
 * Pattern structure rules
 */
export const PatternStructureRules = {
  /** Every section must have a sectionHeader pattern and it must be first */
  sectionHeaderRequired: {
    rule: 'section-header-required' as const,
    position: 'first' as const,
    message: 'Every section must have a pattern with type "sectionHeader" and it must be the first pattern in the section order'
  }
} as const;

// ============================================
// SECTION VALIDATION SCHEMA
// ============================================

/**
 * Complete section validation configuration
 */
export interface SectionValidationConfig {
  /** All allowed section types */
  allowedTypes: readonly SectionType[];
  
  /** Positioning rules */
  positioningRules: typeof SectionPositioningRules;
  
  /** Occurrence rules */
  occurrenceRules: typeof SectionOccurrenceRules;

  /** Pattern structure rules */
  patternStructureRules: typeof PatternStructureRules;
}

/**
 * Default section validation configuration
 */
export const sectionValidationConfig: SectionValidationConfig = {
  allowedTypes: AllowedSectionTypes,
  positioningRules: SectionPositioningRules,
  occurrenceRules: SectionOccurrenceRules,
  patternStructureRules: PatternStructureRules
};

// ============================================
// SECTION METADATA
// ============================================

/**
 * Section metadata for documentation and CMS
 */
export interface SectionMetadata {
  type: SectionType;
  displayName: string;
  description: string;
  icon?: string;
  category?: 'hero' | 'content' | 'conversion' | 'social-proof' | 'utility';
}

/**
 * Metadata for all section types
 */
export const sectionMetadata: Record<SectionType, SectionMetadata> = {
  hero: {
    type: 'hero',
    displayName: 'Hero Section',
    description: 'Landing section with primary call-to-action',
    icon: 'Sparkles',
    category: 'hero'
  },
  about: {
    type: 'about',
    displayName: 'About Section',
    description: 'Company or product information',
    icon: 'Info',
    category: 'content'
  },
  services: {
    type: 'services',
    displayName: 'Services Section',
    description: 'Showcase services or features',
    icon: 'Grid',
    category: 'content'
  },
  testimonials: {
    type: 'testimonials',
    displayName: 'Testimonials',
    description: 'Customer reviews and testimonials',
    icon: 'MessageSquare',
    category: 'social-proof'
  },
  faq: {
    type: 'faq',
    displayName: 'FAQ Section',
    description: 'Frequently asked questions',
    icon: 'HelpCircle',
    category: 'utility'
  },
  pricing: {
    type: 'pricing',
    displayName: 'Pricing Section',
    description: 'Pricing tables and plans',
    icon: 'DollarSign',
    category: 'conversion'
  },
  cta: {
    type: 'cta',
    displayName: 'Call to Action',
    description: 'Conversion-focused section',
    icon: 'ArrowRight',
    category: 'conversion'
  },
  logos: {
    type: 'logos',
    displayName: 'Logo Showcase',
    description: 'Client or partner logos',
    icon: 'Image',
    category: 'social-proof'
  },
  stats: {
    type: 'stats',
    displayName: 'Statistics',
    description: 'Key metrics and numbers',
    icon: 'BarChart',
    category: 'social-proof'
  },
  team: {
    type: 'team',
    displayName: 'Team Section',
    description: 'Team members showcase',
    icon: 'Users',
    category: 'content'
  },
  process: {
    type: 'process',
    displayName: 'Process Section',
    description: 'Step-by-step process or timeline',
    icon: 'GitBranch',
    category: 'content'
  },
  contact: {
    type: 'contact',
    displayName: 'Contact Section',
    description: 'Contact form and information',
    icon: 'Mail',
    category: 'conversion'
  },
  results: {
    type: 'results',
    displayName: 'Results',
    description: 'Search results or case studies',
    icon: 'CheckCircle',
    category: 'content'
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get section metadata by type
 */
export function getSectionMetadata(type: SectionType): SectionMetadata {
  return sectionMetadata[type];
}

/**
 * Get all section types by category
 */
export function getSectionsByCategory(category: SectionMetadata['category']): SectionType[] {
  return Object.values(sectionMetadata)
    .filter(meta => meta.category === category)
    .map(meta => meta.type);
}

/**
 * Check if section type must be in specific position
 */
export function getSectionPositionRequirement(
  type: SectionType
): 'first' | 'last' | null {
  if (type === 'hero') return 'first';
  if (type === 'contact') return 'last';
  return null;
}
