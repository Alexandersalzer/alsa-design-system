/**
 * English translations for BentoGrid component
 */

export const bentoGridTranslations_en = {
  displayName: 'Bento Grid',
  description: 'Flexible grid for complex layouts',
  
  props: {
    columns: {
      displayName: 'Columns',
      description: 'Number of columns (1-12)',
    },
    gap: {
      displayName: 'Gap',
      description: 'Space between elements',
      valueLabels: {
        xs: 'Extra Small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
        '2xl': '2X Large',
      },
    },
    alignItems: {
      displayName: 'Vertical Alignment',
      description: 'How elements align vertically',
      valueLabels: {
        start: 'Top',
        center: 'Center',
        end: 'Bottom',
        stretch: 'Stretch',
      },
    },
  },
};
