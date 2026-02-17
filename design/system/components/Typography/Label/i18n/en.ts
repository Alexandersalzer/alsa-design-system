/**
 * English translations for Label component
 */

export const labelTranslations_en = {
  displayName: 'Label',
  description: 'Small text for labels and descriptions',
  
  props: {
    children: {
      displayName: 'Content',
      description: 'The text to display',
    },
    size: {
      displayName: 'Size',
      description: 'Label size',
      valueLabels: {
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
        regular: 'Regular',
        medium: 'Medium',
        semibold: 'Semibold',
        bold: 'Bold',
      },
    },
  },
};
