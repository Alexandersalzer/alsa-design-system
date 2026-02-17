/**
 * English translations for HStack component
 */

export const hStackTranslations_en = {
  displayName: 'Horizontal Stack',
  description: 'Horizontal layout container for arranging elements in a row',
  
  props: {
    spacing: {
      displayName: 'Spacing',
      description: 'Space between elements',
      valueLabels: {
        xs: 'Extra Small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
      },
    },
    align: {
      displayName: 'Vertical Alignment',
      description: 'How elements align vertically',
      valueLabels: {
        start: 'Top',
        center: 'Center',
        end: 'Bottom',
        baseline: 'Baseline',
        stretch: 'Stretch',
      },
    },
    justify: {
      displayName: 'Horizontal Distribution',
      description: 'How elements are distributed horizontally',
      valueLabels: {
        start: 'Start',
        center: 'Center',
        end: 'End',
        between: 'Between',
        around: 'Around',
        evenly: 'Evenly',
      },
    },
    wrap: {
      displayName: 'Wrap',
      description: 'Whether elements wrap to new line',
    },
  },
};
