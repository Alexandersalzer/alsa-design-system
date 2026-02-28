/**
 * Default Section Layout Schema
 * 
 * Base layout props available to all sections.
 * Individual sections can override/extend these.
 */

import type { SectionSchema } from './section-schema.types';
import type { PropConfig } from '../shared';
import type { SectionType } from './section.types';

/**
 * Common layout props available to most sections
 */
export const defaultSectionLayoutProps: Record<string, PropConfig> = {
  // ============================================
  // HEADER GROUP
  // ============================================
  
  alignSectionHeader: {
    name: 'alignSectionHeader',
    type: 'enum',
    displayName: 'Header Alignment',
    description: 'Alignment of section header. "center" stacks all patterns vertically with center alignment. "left" enables split layout with right column.',
    editorType: 'segmented',
    values: ['left', 'center'],
    valueLabels: {
      left: 'Left',
      center: 'Center'
    },
    default: 'center',
    group: 'header',
    cmsEnabled: true
  },
  
  distanceAction: {
    name: 'distanceAction',
    type: 'boolean',
    displayName: 'Distance Action',
    description: 'Move action buttons to bottom of section',
    editorType: 'toggle',
    default: false,
    group: 'header',
    cmsEnabled: true,
    visibleWhen: {
      // Only show if section has action patterns
      property: '_hasActionPattern',
      operator: 'equals',
      value: true
    }
  },
  
  // ============================================
  // COLUMNS GROUP
  // ============================================
  
  secondColumn: {
    name: 'secondColumn',
    type: 'array',
    displayName: 'Right Column Patterns',
    description: 'Select patterns to display in right column',
    editorType: 'list', // Custom pattern selector handled in SectionLayoutEditor
    items: {
      name: 'pattern',
      type: 'string',
      displayName: 'Pattern'
    },
    default: [],
    group: 'columns',
    cmsEnabled: true,
    visibleWhen: {
      property: 'alignSectionHeader',
      operator: 'equals',
      value: 'left'
    }
  },
  
  verticalAlign: {
    name: 'verticalAlign',
    type: 'enum',
    displayName: 'Vertical Alignment',
    description: 'Vertical alignment between columns',
    editorType: 'segmented',
    values: ['start', 'center', 'end'],
    valueLabels: {
      start: 'Top',
      center: 'Middle',
      end: 'Bottom'
    },
    default: 'center',
    group: 'columns',
    cmsEnabled: true,
    visibleWhen: {
      property: '_hasActiveSecondColumn',
      operator: 'equals',
      value: true
    }
  },
  
  sectionHeaderVerticalAlign: {
    name: 'sectionHeaderVerticalAlign',
    type: 'enum',
    displayName: 'Header Column Alignment',
    description: 'Vertical alignment of section header within its column',
    editorType: 'segmented',
    values: ['start', 'center', 'end'],
    valueLabels: {
      start: 'Top',
      center: 'Middle',
      end: 'Bottom'
    },
    default: 'start',
    group: 'columns',
    cmsEnabled: true,
    visibleWhen: {
      property: '_hasActiveSecondColumn',
      operator: 'equals',
      value: true
    }
  },
  
  // ============================================
  // MOBILE GROUP
  // ============================================
  
  mobileAlign: {
    name: 'mobileAlign',
    type: 'enum',
    displayName: 'Mobile Alignment',
    description: 'Alignment override for mobile screens',
    editorType: 'segmented',
    values: ['left', 'center'],
    valueLabels: {
      left: 'Left',
      center: 'Center'
    },
    group: 'mobile',
    cmsEnabled: true,
    visibleWhen: {
      property: '_viewport',
      operator: 'equals',
      value: 'mobile'
    }
  },
  
  // ============================================
  // BACKGROUND GROUP
  // ============================================
  
  background: {
    name: 'background',
    type: 'enum',
    displayName: 'Background Type',
    description: 'Type of background for the section (or card if wrapInCard is enabled)',
    editorType: 'select',
    values: ['default', 'image', 'gradient', 'generative', 'pattern', 'solid'],
    valueLabels: {
      default: 'Default',
      image: 'Image',
      gradient: 'Gradient',
      generative: 'Generative',
      pattern: 'Pattern',
      solid: 'Solid Color'
    },
    default: 'default',
    group: 'background',
    cmsEnabled: false // Hidden by default, enabled only for specific sections like hero
  },
  
  backgroundImage: {
    name: 'backgroundImage',
    type: 'string',
    displayName: 'Background Image',
    description: 'URL to background image',
    editorType: 'url',
    default: '',
    group: 'background',
    cmsEnabled: false, // Hidden by default, enabled only for specific sections
    visibleWhen: {
      property: 'background',
      operator: 'equals',
      value: 'image'
    }
  },
  
  backgroundSize: {
    name: 'backgroundSize',
    type: 'enum',
    displayName: 'Size',
    description: 'How the image should fit in the container',
    editorType: 'segmented',
    values: ['cover', 'contain'],
    valueLabels: {
      cover: 'Cover',
      contain: 'Contain'
    },
    default: 'cover',
    group: 'background',
    cmsEnabled: false, // Hidden by default, enabled only for specific sections
    visibleWhen: {
      property: 'background',
      operator: 'equals',
      value: 'image'
    }
  },
  
  backgroundPosition: {
    name: 'backgroundPosition',
    type: 'enum',
    displayName: 'Position',
    description: 'Position of the image within the container',
    editorType: 'select',
    values: ['center', 'top', 'bottom', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'],
    valueLabels: {
      center: 'Center',
      top: 'Top',
      bottom: 'Bottom',
      left: 'Left',
      right: 'Right',
      'top left': 'Top Left',
      'top right': 'Top Right',
      'bottom left': 'Bottom Left',
      'bottom right': 'Bottom Right'
    },
    default: 'center',
    group: 'background',
    cmsEnabled: false, // Hidden by default, enabled only for specific sections
    visibleWhen: {
      property: 'background',
      operator: 'equals',
      value: 'image'
    }
  },
  
  backgroundOpacity: {
    name: 'backgroundOpacity',
    type: 'number',
    displayName: 'Opacity',
    description: 'Image opacity (0 = transparent, 1 = fully opaque)',
    editorType: 'slider',
    min: 0,
    max: 1,
    step: 0.05,
    default: 1,
    group: 'background',
    cmsEnabled: false, // Hidden by default, enabled only for specific sections
    visibleWhen: {
      property: 'background',
      operator: 'equals',
      value: 'image'
    }
  },
  
  backgroundTint: {
    name: 'backgroundTint',
    type: 'enum',
    displayName: 'Accent Tint',
    description: 'Apply accent color tint to the image',
    editorType: 'segmented',
    values: ['none', 'accent'],
    valueLabels: {
      none: 'No tint',
      accent: 'Accent color'
    },
    default: 'none',
    group: 'background',
    cmsEnabled: false, // Hidden by default, enabled only for specific sections
    visibleWhen: {
      property: 'background',
      operator: 'equals',
      value: 'image'
    }
  },
  
  imageFadeEdge: {
    name: 'imageFadeEdge',
    type: 'enum',
    displayName: 'Fade Edge',
    description: 'Add a gradient fade to an edge of the image',
    editorType: 'select',
    values: ['none', 'top', 'bottom', 'left', 'right'],
    valueLabels: {
      none: 'No fade',
      top: 'Top',
      bottom: 'Bottom',
      left: 'Left',
      right: 'Right'
    },
    default: 'none',
    group: 'background',
    cmsEnabled: false, // Hidden by default, enabled only for specific sections
    visibleWhen: {
      property: 'background',
      operator: 'equals',
      value: 'image'
    }
  },
  
  imageFadeStrength: {
    name: 'imageFadeStrength',
    type: 'number',
    displayName: 'Fade Strength',
    description: 'Strength of the fade effect (0-1)',
    editorType: 'slider',
    min: 0,
    max: 1,
    step: 0.05,
    default: 0.15,
    group: 'background',
    cmsEnabled: false, // Hidden by default, enabled only for specific sections
    visibleWhen: {
      property: 'imageFadeEdge',
      operator: 'notEquals',
      value: 'none'
    }
  },
  
  // Legacy prop - kept for backward compatibility
  backgroundImageLightModeOpacity: {
    name: 'backgroundImageLightModeOpacity',
    type: 'number',
    displayName: 'Light Mode Opacity (Legacy)',
    description: 'Image opacity in light mode (0-1) - use backgroundOpacity instead',
    editorType: 'slider',
    min: 0,
    max: 1,
    step: 0.05,
    default: 1,
    group: 'background',
    cmsEnabled: false, // Deprecated - use backgroundOpacity
    visibleWhen: {
      property: 'background',
      operator: 'equals',
      value: 'image'
    }
  },
  
  // ============================================
  // CARD GROUP
  // ============================================
  
  wrapInCard: {
    name: 'wrapInCard',
    type: 'boolean',
    displayName: 'Wrap in Card',
    description: 'Wrap section content in a card container with elevation and border',
    editorType: 'toggle',
    default: false,
    group: 'card',
    cmsEnabled: true
  }
};

/**
 * Default section schema (base for all sections)
 */
export const defaultSectionSchemaBase: Omit<SectionSchema, '$id' | 'category' | 'displayName'> = {
  description: 'Base section configuration',
  version: '1.0.0',
  layoutProps: defaultSectionLayoutProps,
  cmsEnabled: true,
  
  defaultLayout: {
    alignSectionHeader: 'center',
    distanceAction: false,
    secondColumn: [],
    verticalAlign: 'center',
    sectionHeaderVerticalAlign: 'start',
    background: 'default',
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundOpacity: 1,
    backgroundTint: 'none',
    imageFadeEdge: 'none',
    imageFadeStrength: 0.15,
    backgroundImageLightModeOpacity: 1, // Legacy - use backgroundOpacity
    wrapInCard: false
  },
  
  validation: [
    {
      id: 'alignment-restriction',
      message: 'Section header alignment must be either "left" or "center"',
      validator: (value: any, allProps: any) => {
        const align = allProps.alignSectionHeader;
        return !align || align === 'left' || align === 'center';
      },
      severity: 'error'
    },
    {
      id: 'second-column-requires-left-align',
      message: 'secondColumn requires alignSectionHeader to be "left"',
      validator: (value: any, allProps: any) => {
        const hasSecondColumn = allProps.secondColumn?.length > 0;
        const isLeftAligned = allProps.alignSectionHeader === 'left';
        return !hasSecondColumn || isLeftAligned;
      },
      severity: 'warning'
    },
    {
      id: 'center-alignment-cascade',
      message: 'When alignSectionHeader is "center", all patterns are center-aligned and stacked vertically',
      validator: (value: any, allProps: any) => {
        // This rule is enforced automatically by the renderer
        // When alignSectionHeader === 'center':
        // - All patterns rendered in single VStack with align="center"
        // - secondColumn is cleared
        // - Layout context passes align: 'center' to all patterns
        return true; // Always valid - this is informational/enforcement note
      },
      severity: 'info'
    }
  ]
};

/**
 * Validation result for section layout
 */
export interface SectionLayoutValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate section layout against schema rules
 * @param layout - Layout configuration to validate
 * @param sectionType - Type of section being validated
 * @returns Validation result with errors and warnings
 */
export function validateSectionLayout(
  layout: any,
  sectionType: SectionType
): SectionLayoutValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Run validation rules from schema
  for (const rule of defaultSectionSchemaBase.validation || []) {
    // Skip string validators (expressions not supported yet)
    if (typeof rule.validator === 'string') {
      continue;
    }
    
    const isValid = rule.validator(layout, layout);
    
    if (!isValid) {
      if (rule.severity === 'error') {
        errors.push(rule.message);
      } else if (rule.severity === 'warning') {
        warnings.push(rule.message);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
