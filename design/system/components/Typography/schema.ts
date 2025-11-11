// ===============================================
// blimpify-ui/design/system/schemas/components/TypographySchema.ts
// Schema definition for Text component (Typography)
// ===============================================

import { ComponentSchema } from '../../core/validation/schemaValidator';

export const TypographySchema: ComponentSchema = {
  type: 'text',
  props: {
    content: {
      type: 'string',
      required: true,
      description: 'Text content to display'
    },
    variant: {
      type: 'enum',
      values: ['display', 'heading', 'body', 'label', 'code'],
      default: 'body',
      description: 'Type of text component - each has smart defaults for size, color, and weight'
    },
    size: {
      type: 'enum',
      values: ['xs', 'sm', 'md', 'lg', 'xl'],
      default: 'md',
      description: 'Size - maps to appropriate size for each variant (xs=smallest, xl=largest)'
    },
    role: {
      type: 'enum',
      values: ['title', 'email', 'legal', 'attribute', 'body', 'heading', 'subtitle'],
      description: 'Semantic role for pattern layout placement'
    }
  },
  requiredProps: ['content']
};