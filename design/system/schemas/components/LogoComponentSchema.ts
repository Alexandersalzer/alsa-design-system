// ===============================================
// blimpify-ui/design/system/schemas/components/LogoComponentSchema.ts
// Schema definition for Logo component
// ===============================================

import { ComponentSchema } from '../types/base';

export const LogoComponentSchema: ComponentSchema = {
  type: 'logo',
  props: {
    src: {
      type: 'string',
      required: true,
      description: 'Logo image source URL'
    },
    alt: {
      type: 'string',
      required: true,
      description: 'Alternative text for the logo'
    },
    size: {
      type: 'enum',
      values: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      default: 'md',
      description: 'Logo size preset'
    },
    variant: {
      type: 'enum',
      values: ['contain', 'cover', 'fill'],
      default: 'contain',
      description: 'How the logo should fit within its container'
    },
    role: {
      type: 'string',
      description: 'Semantic role for pattern layout placement'
    },
    fallbackText: {
      type: 'string',
      description: 'Text to show if logo fails to load'
    },
    maxWidth: {
      type: 'string',
      description: 'Maximum width CSS value'
    },
    maxHeight: {
      type: 'string',
      description: 'Maximum height CSS value'
    }
  }
};