// ===============================================
// blimpify-ui/design/system/schemas/sections/FooterSectionSchema.ts
// Schema definition for Footer section
// ===============================================

import { SectionSchema, CommonProps } from '../types/base';

export const FooterSectionSchema: SectionSchema = {
  type: 'footer',
  props: {
    background: {
      type: 'enum',
      values: ['light', 'dark', 'transparent'],
      default: 'dark',
      description: 'Footer section background color theme'
    },
    spacing: {
      type: 'enum',
      values: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      default: 'lg',
      description: 'Vertical spacing between footer patterns'
    }
  },
  patterns: {
    kj: {
      type: 'kj',
      props: {} // Pattern-specific props defined in KjFooterPatternSchema
    },
    footer: {
      type: 'footer', 
      props: {} // Pattern-specific props defined in FooterPatternSchema
    }
  },
  requiredPatterns: [] // Footer sections don't require sectionBody
};