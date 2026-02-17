/**
 * Swedish translations for Rhythm component
 */

export const rhythmTranslations_sv = {
  displayName: 'Rytm',
  description: 'Baslinje-grid layout med positionerade element',
  
  props: {
    unit: {
      displayName: 'Enhet',
      description: 'Basenhet för baslinje-grid mellanrum',
      valueLabels: {
        xs: 'Extra liten (8px)',
        sm: 'Liten (12px)',
        md: 'Medium (16px)',
        lg: 'Stor (24px)',
        xl: 'Extra stor (32px)',
        '2xl': '2X Stor (48px)',
      },
    },
    align: {
      displayName: 'Justering',
      description: 'Hur element justeras',
      valueLabels: {
        start: 'Start',
        center: 'Center',
        end: 'Slut',
        stretch: 'Sträck',
      },
    },
    direction: {
      displayName: 'Riktning',
      description: 'Layout-riktning',
      valueLabels: {
        column: 'Kolumn',
        row: 'Rad',
      },
    },
  },
};
