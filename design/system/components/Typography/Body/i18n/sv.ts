/**
 * Swedish translations for Body component
 */

export const bodyTranslations_sv = {
  displayName: 'Brödtext',
  description: 'Standardtext för paragrafer och innehåll',
  
  props: {
    children: {
      displayName: 'Innehåll',
      description: 'Texten som ska visas',
    },
    size: {
      displayName: 'Storlek',
      description: 'Textstorlek',
      valueLabels: {
        xl: 'Extra stor',
        lg: 'Stor',
        md: 'Medium',
        sm: 'Liten',
        xs: 'Extra liten',
      },
    },
    color: {
      displayName: 'Färg',
      description: 'Textfärg',
    },
    weight: {
      displayName: 'Vikt',
      description: 'Typsnittsvikt',
      valueLabels: {
        light: 'Lätt',
        regular: 'Normal',
        medium: 'Medium',
        semibold: 'Halvfet',
        bold: 'Fet',
      },
    },
    align: {
      displayName: 'Justering',
      description: 'Textjustering',
      valueLabels: {
        left: 'Vänster',
        center: 'Center',
        right: 'Höger',
        justify: 'Marginaljusterad',
      },
    },
  },
};
