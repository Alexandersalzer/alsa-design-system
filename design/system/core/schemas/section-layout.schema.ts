/**
 * Default Section Layout Schema
 * 
 * Base layout props available to all sections.
 * Individual sections can override/extend these.
 */

import type { SectionSchema } from './section-schema.types';
import type { PropConfig } from './shared';

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
    description: 'Alignment of section header. "left" enables split layout with right column.',
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
  
  ratio: {
    name: 'ratio',
    type: 'enum',
    displayName: 'Column Ratio',
    description: 'Width ratio between first and second column',
    editorType: 'segmented',
    values: ['1:1', '1:2', '2:1', '2:3', '3:2'],
    valueLabels: {
      '1:1': '1:1',
      '1:2': '1:2',
      '2:1': '2:1',
      '2:3': '2:3',
      '3:2': '3:2'
    },
    default: '1:1',
    group: 'columns',
    cmsEnabled: true,
    visibleWhen: {
      property: '_hasActiveSecondColumn',
      operator: 'equals',
      value: true
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
  
  stackAt: {
    name: 'stackAt',
    type: 'enum',
    displayName: 'Stack At',
    description: 'Breakpoint when split layout collapses to single column',
    editorType: 'segmented',
    values: ['tablet', 'desktop'],
    valueLabels: {
      tablet: 'Tablet',
      desktop: 'Desktop'
    },
    default: 'desktop',
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
    ratio: '1:1',
    verticalAlign: 'center',
    sectionHeaderVerticalAlign: 'start',
    stackAt: 'desktop'
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
    }
  ]
};
