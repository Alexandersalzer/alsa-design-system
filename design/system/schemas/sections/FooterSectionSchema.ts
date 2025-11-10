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
      description: 'Footer background color theme'
    },
    align: CommonProps.align
  },
  patterns: {
    kj: {
      type: 'kj',
      props: {
        layout: {
          type: 'enum',
          values: ['single-column', 'multi-column', 'centered'],
          default: 'single-column',
          description: 'Footer layout style'
        }
      }
    },
    footer: {
      type: 'footer',
      props: {
        layout: {
          type: 'enum',
          values: ['simple', 'detailed', 'minimal'],
          default: 'simple'
        }
      }
    }
  },
  requiredPatterns: [] // Footer sections don't require sectionBody
};