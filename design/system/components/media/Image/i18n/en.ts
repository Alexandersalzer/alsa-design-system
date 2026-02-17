/**
 * English translations for Image component
 */

export const imageTranslations_en = {
  displayName: 'Image',
  description: 'Responsive image component with lazy loading and placeholders',
  
  props: {
    src: {
      displayName: 'Source',
      description: 'Image URL',
    },
    alt: {
      displayName: 'Alt Text',
      description: 'Alternative text for accessibility',
    },
    width: {
      displayName: 'Width',
      description: 'Image width',
    },
    height: {
      displayName: 'Height',
      description: 'Image height',
    },
    objectFit: {
      displayName: 'Object Fit',
      description: 'How image fits container',
      valueLabels: {
        cover: 'Cover',
        contain: 'Contain',
        fill: 'Fill',
        none: 'None',
        'scale-down': 'Scale Down',
      },
    },
    radius: {
      displayName: 'Radius',
      description: 'Corner radius',
      valueLabels: {
        none: 'None',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
        full: 'Full',
      },
    },
    aspectRatio: {
      displayName: 'Aspect Ratio',
      description: 'Aspect ratio (e.g., 16/9)',
    },
    loading: {
      displayName: 'Loading',
      description: 'Loading strategy',
      valueLabels: {
        lazy: 'Lazy',
        eager: 'Eager',
      },
    },
    priority: {
      displayName: 'Priority',
      description: 'Priority loading',
    },
    hoverZoom: {
      displayName: 'Hover Zoom',
      description: 'Enable zoom on hover',
    },
  },
};
