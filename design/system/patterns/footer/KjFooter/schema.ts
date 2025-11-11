// ===============================================
// blimpify-ui/design/system/schemas/patterns/KjFooterPatternSchema.ts
// Schema definition for KJ Footer pattern
// ===============================================

import { PatternSchema } from '../../../core/validation/schemaValidator';

export const KjFooterPatternSchema: PatternSchema = {
  type: 'kj',
  props: {
    // No specific props for KjFooter pattern yet
  },
  allowedComponents: ['text'],
  requiredRoles: ['title'] // At minimum, we need a title
};