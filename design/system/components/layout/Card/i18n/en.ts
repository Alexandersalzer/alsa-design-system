/**
 * English translations for Card component
 */

export const cardTranslations_en = {
  displayName: 'Card',
  description: 'Container component for grouping related content',
  
  props: {
    variant: {
      displayName: 'Variant',
      description: 'Visual style variant',
      valueLabels: {
        default: 'Default',
        raised: 'Raised',
        elevated: 'Elevated',
        outlined: 'Outlined',
        solid: 'Solid',
        ghost: 'Ghost',
        bordered: 'Bordered',
        'accent-subtle': 'Accent Subtle',
        'accent-muted': 'Accent Muted',
      },
    },
    padding: {
      displayName: 'Padding',
      description: 'Inner padding',
      valueLabels: {
        none: 'None',
        xs: 'Extra Small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    radius: {
      displayName: 'Radius',
      description: 'Corner radius',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    interactive: {
      displayName: 'Interactive',
      description: 'Whether card is clickable',
    },
  },
};
