/**
 * English translations for Grid component
 */

export const gridTranslations_en = {
  displayName: 'Grid',
  description: 'Responsive grid system for layouts',
  
  props: {
    columns: {
      displayName: 'Columns',
      description: 'Number of columns',
    },
    spacing: {
      displayName: 'Spacing',
      description: 'Space between cells',
      valueLabels: {
        none: 'None',
        xs: 'Extra Small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
      },
    },
    cardDensity: {
      displayName: 'Card Density',
      description: 'Automatic column sizing based on density',
      valueLabels: {
        compact: 'Compact',
        standard: 'Standard',
        spacious: 'Spacious',
      },
    },
  },
};
