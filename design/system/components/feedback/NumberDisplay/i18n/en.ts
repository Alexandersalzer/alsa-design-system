/**
 * English translations for NumberDisplay component
 */

export const numberDisplayTranslations_en = {
  displayName: 'Number Display',
  description: 'Displays numbers with button-like variants',

  props: {
    value: {
      displayName: 'Value',
      description: 'The number or text to display',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visual style',
      valueLabels: {
        brand: 'Brand',
        primary: 'Primary',
        secondary: 'Secondary',
        accent: 'Accent',
        ghost: 'Ghost',
        raised: 'Raised',
        bare: 'Bare',
      },
    },
    size: {
      displayName: 'Size',
      description: 'Size of the display',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra large',
      },
    },
    shape: {
      displayName: 'Shape',
      description: 'Corner rounding',
      valueLabels: {
        square: 'Square',
        rounded: 'Rounded',
        circle: 'Circle',
      },
    },
  },
};
