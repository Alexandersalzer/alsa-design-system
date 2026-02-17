/**
 * English translations for Body component
 */

export const bodyTranslations_en = {
  displayName: 'Body Text',
  description: 'Standard text for paragraphs and content',
  
  props: {
    content: {
      displayName: 'Content',
      description: 'The text to display',
    },
    size: {
      displayName: 'Size',
      description: 'Text size',
      valueLabels: {
        xl: 'Extra Large',
        lg: 'Large',
        md: 'Medium',
        sm: 'Small',
        xs: 'Extra Small',
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
