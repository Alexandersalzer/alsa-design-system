/**
 * Swedish translations for Display component
 */

export const displayTranslations_sv = {
  displayName: 'Display-text',
  description: 'Extra stor display-text för rubriker och hero-sektioner',
  
  props: {
    content: {
      displayName: 'Innehåll',
      description: 'Texten som ska visas',
    },
    size: {
      displayName: 'Storlek',
      description: 'Display-storlek',
      valueLabels: {
        xl: 'Extra stor',
        lg: 'Stor',
        md: 'Medium',
        sm: 'Liten',
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
        extrabold: 'Extra fet',
        black: 'Svart',
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
