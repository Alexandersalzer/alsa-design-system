/**
 * Section Layout Schema
 * 
 * Defines validation rules for section layouts.
 * Used for:
 * - Validating section layout in page files
 * - Providing type safety and documentation
 */

import type { SectionType } from './section.types';

// ============================================
// LAYOUT FIELD TYPES
// ============================================

export type SectionHeaderAlignment = 'left' | 'center';
export type VerticalAlignment = 'start' | 'center' | 'end';
export type ColumnRatio = '1:1' | '1:2' | '2:1' | '2:3' | '3:2';
export type LayoutGap = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type StackBreakpoint = 'tablet' | 'desktop';

// ============================================
// SECTION LAYOUT RULES
// ============================================

/**
 * Layout field validation rules
 */
export interface SectionLayoutRules {
  // SectionHeader alignment - only 'left' and 'center' allowed
  alignSectionHeader: {
    allowedValues: SectionHeaderAlignment[];
    default: SectionHeaderAlignment;
    rule: string;
    message: string;
  };
  
  // Vertical align for columns
  verticalAlign: {
    allowedValues: VerticalAlignment[];
    default: VerticalAlignment;
  };
  
  // SectionHeader vertical align
  sectionHeaderVerticalAlign: {
    allowedValues: VerticalAlignment[];
    default: VerticalAlignment;
  };
  
  // Column ratio
  ratio: {
    allowedValues: ColumnRatio[];
    default: ColumnRatio;
  };
  
  // Gap between patterns/columns
  gap: {
    allowedValues: LayoutGap[];
    default: LayoutGap;
  };
  
  // Stack breakpoint
  stackAt: {
    allowedValues: StackBreakpoint[];
    default: StackBreakpoint;
  };
}

/**
 * Default section layout rules
 */
export const sectionLayoutRules: SectionLayoutRules = {
  alignSectionHeader: {
    allowedValues: ['left', 'center'],
    default: 'center',
    rule: 'alignment-restriction',
    message: 'Section header alignment must be either "left" or "center". "right" is not allowed.'
  },
  
  verticalAlign: {
    allowedValues: ['start', 'center', 'end'],
    default: 'center'
  },
  
  sectionHeaderVerticalAlign: {
    allowedValues: ['start', 'center', 'end'],
    default: 'start'
  },
  
  ratio: {
    allowedValues: ['1:1', '1:2', '2:1', '2:3', '3:2'],
    default: '1:1'
  },
  
  gap: {
    allowedValues: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    default: 'xl'
  },
  
  stackAt: {
    allowedValues: ['tablet', 'desktop'],
    default: 'desktop'
  }
};

// ============================================
// SECTION-SPECIFIC LAYOUT RULES
// ============================================

/**
 * Some sections may have specific layout requirements
 * Override default rules per section type
 */
export const sectionSpecificLayoutRules: Partial<Record<SectionType, Partial<SectionLayoutRules>>> = {
  hero: {
    alignSectionHeader: {
      ...sectionLayoutRules.alignSectionHeader,
      default: 'center'
    }
  },
  
  contact: {
    alignSectionHeader: {
      ...sectionLayoutRules.alignSectionHeader,
      default: 'center'
    }
  }
};

/**
 * Get layout rules for specific section type
 */
export function getSectionLayoutRules(sectionType?: SectionType): SectionLayoutRules {
  if (!sectionType) return sectionLayoutRules;
  
  const specificRules = sectionSpecificLayoutRules[sectionType];
  if (!specificRules) return sectionLayoutRules;
  
  // Merge specific rules with default rules
  return {
    ...sectionLayoutRules,
    ...specificRules
  };
}

// ============================================
// VALIDATION HELPERS
// ============================================

/**
 * Validate section layout configuration
 */
export function validateSectionLayout(
  layout: any,
  sectionType?: SectionType
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const rules = getSectionLayoutRules(sectionType);
  
  // Validate alignSectionHeader - ONLY 'left' and 'center' allowed
  if (layout.alignSectionHeader) {
    if (!rules.alignSectionHeader.allowedValues.includes(layout.alignSectionHeader)) {
      errors.push(
        `Invalid alignSectionHeader: "${layout.alignSectionHeader}". ${rules.alignSectionHeader.message}`
      );
    }
  }
  
  // Validate verticalAlign
  if (layout.verticalAlign) {
    if (!rules.verticalAlign.allowedValues.includes(layout.verticalAlign)) {
      errors.push(
        `Invalid verticalAlign: "${layout.verticalAlign}". ` +
        `Allowed: ${rules.verticalAlign.allowedValues.join(', ')}`
      );
    }
  }
  
  // Validate sectionHeaderVerticalAlign
  if (layout.sectionHeaderVerticalAlign) {
    if (!rules.sectionHeaderVerticalAlign.allowedValues.includes(layout.sectionHeaderVerticalAlign)) {
      errors.push(
        `Invalid sectionHeaderVerticalAlign: "${layout.sectionHeaderVerticalAlign}". ` +
        `Allowed: ${rules.sectionHeaderVerticalAlign.allowedValues.join(', ')}`
      );
    }
  }
  
  // Validate ratio
  if (layout.ratio) {
    if (!rules.ratio.allowedValues.includes(layout.ratio)) {
      errors.push(
        `Invalid ratio: "${layout.ratio}". ` +
        `Allowed: ${rules.ratio.allowedValues.join(', ')}`
      );
    }
  }
  
  // Validate gap
  if (layout.gap) {
    if (!rules.gap.allowedValues.includes(layout.gap)) {
      errors.push(
        `Invalid gap: "${layout.gap}". ` +
        `Allowed: ${rules.gap.allowedValues.join(', ')}`
      );
    }
  }
  
  // Validate stackAt
  if (layout.stackAt) {
    if (!rules.stackAt.allowedValues.includes(layout.stackAt)) {
      errors.push(
        `Invalid stackAt: "${layout.stackAt}". ` +
        `Allowed: ${rules.stackAt.allowedValues.join(', ')}`
      );
    }
  }
  
  // Warning: secondColumn without alignSectionHeader = 'left'
  if (layout.secondColumn && Array.isArray(layout.secondColumn) && layout.secondColumn.length > 0) {
    if (layout.alignSectionHeader !== 'left') {
      warnings.push(
        'secondColumn is defined but alignSectionHeader is not "left". ' +
        'Split layout requires alignSectionHeader to be "left"'
      );
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
