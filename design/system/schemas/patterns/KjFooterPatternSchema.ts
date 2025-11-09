// ===============================================
// blimpify-ui/design/system/schemas/patterns/KjFooterPatternSchema.ts
// Schema definition for KJ Footer pattern
// ===============================================

import { PatternSchema } from '../types/base';

export const KjFooterPatternSchema: PatternSchema = {
  type: 'kj',
  props: {
    layout: {
      type: 'enum',
      values: ['default', 'compact', 'extended'],
      default: 'default',
      description: 'Footer layout variant'
    }
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
        variant: {
          type: 'enum',
          values: ['heading', 'body'],
          default: 'body',
          description: 'Typography variant'
        },
        size: {
          type: 'enum',
          values: ['xs', 'sm', 'md', 'lg', 'xl'],
          default: 'sm',
          description: 'Size mapping for variant'
        },
        align: {
          type: 'enum',
          values: ['left', 'center', 'right', 'justify'],
          default: 'center',
          description: 'Text alignment'
        },
        role: {
          type: 'enum',
          values: ['title', 'email', 'legal', 'attribute'],
          required: true,
          description: 'Component role for layout placement - title: next to logo, email/legal: middle section, attribute: bottom section'
        }
      }
    }
  }
};