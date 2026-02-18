/**
 * English translations for Heading component
 */

export const headingTranslations_en = {
  displayName: 'Heading',
  description: 'Heading component for structure and hierarchy',
  
  props: {
    content: {
      displayName: 'Content',
      description: 'Heading text',
    },
    variant: {
      displayName: 'Variant',
      description: 'Heading level and size',
      valueLabels: {
        'display-2xl': 'Display 2XL',
        'display-xl': 'Display XL',
        'display-lg': 'Display L',
        'display-md': 'Display M',
        'display-sm': 'Display S',
        h1: 'Heading 1',
        h2: 'Heading 2',
        h3: 'Heading 3',
        h4: 'Heading 4',
        h5: 'Heading 5',
        h6: 'Heading 6',
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
        extrabold: 'Extrabold',
        black: 'Black',
      },
    },
    align: {
      displayName: 'Alignment',
      description: 'Text alignment',
      valueLabels: {
        left: 'Left',
        center: 'Center',
        right: 'Right',
        justify: 'Justify',
      },
    },
  },
};
