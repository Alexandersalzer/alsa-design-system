// ===============================================
// blimpify-ui/design/system/schemas/patterns/KjFooterPatternSchema.ts
// Schema definition for KJ Footer pattern
// ===============================================

import { PatternSchema } from '../../../core/schemas/types/base';

export const KjFooterPatternSchema: PatternSchema = {
  type: 'kj',
  props: {
    // No specific props for KjFooter pattern yet
  },
  components: {
    text: {
      type: 'text',
      props: {
        content: {
          type: 'string',
          required: true,
          description: 'Text content to display'
        },
        role: {
          type: 'enum',
          values: ['title', 'email', 'legal', 'attribute'],
          description: 'Semantic role for layout placement'
        }
      }
    }
  },
  requiredComponents: ['text'] // At minimum, we need text components
};