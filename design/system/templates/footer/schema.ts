// ===============================================
// blimpify-ui/design/system/schemas/sections/FooterSectionSchema.ts
// Schema definition for Footer section
// ===============================================

import { SectionSchema } from '../../core/schemas/types/base';

export const FooterSectionSchema: SectionSchema = {
  type: 'footer',
  props: {
    background: {
      type: 'string',
      description: 'Background color or style for the footer section'
    }
  },
  patterns: {
    kj: {
      type: 'kj',
      props: {}
    }
  },
  requiredPatterns: [] // Footer sections don't require specific patterns
};