/**
 * English translations for VStack component
 */

export const vStackTranslations_en = {
  displayName: 'Vertical Stack',
  description: 'Vertical layout container for arranging elements in a column',
  
  props: {
    spacing: {
      displayName: 'Spacing',
      description: 'Space between elements',
      valueLabels: {
        none: 'None',
        xs: 'Extra Small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
        '2xl': '2X Large',
        '3xl': '3X Large',
      },
    },
    align: {
      displayName: 'Horizontal Alignment',
      description: 'How elements align horizontally',
      valueLabels: {
        start: 'Left',
        center: 'Center',
        end: 'Right',
        stretch: 'Stretch',
      },
    },
    justify: {
      displayName: 'Vertical Distribution',
      description: 'How elements are distributed vertically',
      valueLabels: {
        start: 'Top',
        center: 'Center',
        end: 'Bottom',
        between: 'Between',
        around: 'Around',
        evenly: 'Evenly',
      },
    },
    fullWidth: {
      displayName: 'Full Width',
      description: 'Take full available width',
    },
  },
};
