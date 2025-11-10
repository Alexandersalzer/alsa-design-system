// ===============================================
// blimpify-ui/design/system/schemas/sections/FooterSectionSchema.ts
// Schema definition for Footer section
// ===============================================

import { SectionSchema, StandardProps } from '../types/base';

export const FooterSectionSchema: SectionSchema = {
  type: 'footer',
  props: {
    background: StandardProps.background
  },
  patterns: {
    kj: {
      type: 'kj',
      props: {
      }
    }
  },
  requiredPatterns: [] // Footer sections don't require sectionBody
};