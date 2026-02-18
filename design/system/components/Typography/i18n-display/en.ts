/**
 * English translations for Display component
 */

export const displayTranslations_en = {
  displayName: 'Display Text',
  description: 'Extra large display text for headings and hero sections',
  
  props: {
    content: {
      displayName: 'Content',
      description: 'The text to display',
    },
    size: {
      displayName: 'Size',
      description: 'Display size',
      valueLabels: {
        xl: 'Extra Large',
        lg: 'Large',
        md: 'Medium',
        sm: 'Small',
      },
    },
    color: {
      displayName: 'Color',
      description: 'Text color',
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
