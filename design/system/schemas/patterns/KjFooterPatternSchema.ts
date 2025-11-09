// ===============================================
// blimpify-ui/design/system/schemas/patterns/KjFooterPatternSchema.ts
// Schema definition for KJ Footer pattern
// ===============================================

import { PatternSchema } from '../types/base';

export const KjFooterPatternSchema: PatternSchema = {
  type: 'kj',
  props: {
    logoSpacing: {
      type: 'enum',
      values: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      default: 'xl',
      description: 'Spacing between logo and content sections'
    },
    contentSpacing: {
      type: 'enum',
      values: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      default: 'xs', 
      description: 'Spacing between text components'
    },
    showLogo: {
      type: 'boolean',
      default: true,
      description: 'Whether to show the KJ logo'
    }
  },
  components: {
    title: {
      type: 'text',
      props: {
        content: {
          type: 'string',
          required: true,
          description: 'Footer title text'
        },
        variant: {
          type: 'enum',
          values: ['heading'],
          default: 'heading',
          description: 'Typography variant for title'
        },
        size: {
          type: 'enum',
          values: ['xs', 'sm', 'md', 'lg', 'xl'],
          default: 'md',
          description: 'Size mapping for heading variant'
        },
        align: {
          type: 'enum',
          values: ['left', 'center', 'right', 'justify'],
          default: 'center',
          description: 'Text alignment'
        }
      }
    },
    body: {
      type: 'text',
      props: {
        content: {
          type: 'string',
          required: true,
          description: 'Footer body text content'
        },
        variant: {
          type: 'enum',
          values: ['body'],
          default: 'body',
          description: 'Typography variant for body text'
        },
        size: {
          type: 'enum',
          values: ['xs', 'sm', 'md', 'lg', 'xl'],
          default: 'sm',
          description: 'Size mapping for body variant'
        },
        align: {
          type: 'enum',
          values: ['left', 'center', 'right', 'justify'],
          default: 'center',
          description: 'Text alignment'
        }
      }
    }
  }
};