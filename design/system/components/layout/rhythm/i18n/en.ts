/**
 * English translations for Rhythm component
 */

export const rhythmTranslations_en = {
  displayName: 'Rhythm',
  description: 'Baseline grid layout with positioned elements',
  
  props: {
    unit: {
      displayName: 'Unit',
      description: 'Base unit for baseline grid spacing',
      valueLabels: {
        xs: 'Extra Small (8px)',
        sm: 'Small (12px)',
        md: 'Medium (16px)',
        lg: 'Large (24px)',
        xl: 'Extra Large (32px)',
        '2xl': '2X Large (48px)',
      },
    },
    align: {
      displayName: 'Alignment',
      description: 'How elements align',
      valueLabels: {
        start: 'Start',
        center: 'Center',
        end: 'End',
        stretch: 'Stretch',
      },
    },
    direction: {
      displayName: 'Direction',
      description: 'Layout direction',
      valueLabels: {
        column: 'Column',
        row: 'Row',
      },
    },
  },
};
