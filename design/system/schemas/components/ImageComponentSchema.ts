// ===============================================
// blimpify-ui/design/system/schemas/components/ImageComponentSchema.ts
// Schema definition for Image component
// ===============================================

import { ComponentSchema } from '../types/base';

export const ImageComponentSchema: ComponentSchema = {
  type: 'image',
  props: {
    src: {
      type: 'string',
      required: true,
      description: 'Image source URL or path'
    },
    alt: {
      type: 'string',
      required: true,
      description: 'Alternative text for accessibility'
    },
    width: {
      type: 'number',
      description: 'Image width in pixels'
    },
    height: {
      type: 'number',
      description: 'Image height in pixels'
    },
    className: {
      type: 'string',
      description: 'Additional CSS classes'
    },
    objectFit: {
      type: 'enum',
      values: ['contain', 'cover', 'fill', 'none', 'scale-down'],
      default: 'contain',
      description: 'How the image should be resized to fit its container'
    }
  }
};