/**
 * English translations for CountUp component
 */

export const countUpTranslations_en = {
  displayName: 'Counter',
  description: 'Animated number that counts up to a value',
  
  props: {
    start: {
      displayName: 'Start Value',
      description: 'The value to start counting from',
    },
    end: {
      displayName: 'End Value',
      description: 'The value to count to',
    },
    suffix: {
      displayName: 'Suffix',
      description: 'Character after the number',
      valueLabels: {
        '': 'None',
        '+': '+',
        'k+': 'k+',
        '%': '%',
        'kr': 'kr',
      },
    },
    duration: {
      displayName: 'Duration',
      description: 'Animation duration in milliseconds',
    },
    enableScrollTrigger: {
      displayName: 'Enable Scroll Trigger',
      description: 'Start animation when element is visible',
    },
    triggerOffset: {
      displayName: 'Trigger Offset',
      description: 'Pixels from bottom of viewport',
    },
    variant: {
      displayName: 'Variant',
      description: 'Typography variant for the number',
      valueLabels: {
        'display-xl': 'Display XL',
        'display-lg': 'Display L',
        'display-md': 'Display M',
        'display-sm': 'Display S',
        'h1': 'Heading 1',
        'h2': 'Heading 2',
        'h3': 'Heading 3',
        'body-xl': 'Body XL',
        'body-lg': 'Body L',
      },
    },
    size: {
      displayName: 'Size',
      description: 'Text size',
      valueLabels: {
        xl: 'Extra Large',
        lg: 'Large',
        md: 'Medium',
        sm: 'Small',
      },
    },
    weight: {
      displayName: 'Weight',
      description: 'Font weight',
      valueLabels: {
        light: 'Light',
        regular: 'Regular',
        medium: 'Medium',
        semibold: 'Semibold',
        bold: 'Bold',
        extrabold: 'Extra Bold',
        black: 'Black',
      },
    },
    color: {
      displayName: 'Color',
      description: 'Text color',
      valueLabels: {
        primary: 'Primary',
        secondary: 'Secondary',
        heading: 'Heading',
        body: 'Body',
        accent: 'Accent',
        brand: 'Brand',
        success: 'Success',
        warning: 'Warning',
        error: 'Error',
      },
    },
    align: {
      displayName: 'Alignment',
      description: 'Text alignment',
      valueLabels: {
        left: 'Left',
        center: 'Center',
        right: 'Right',
      },
    },
  },
};
