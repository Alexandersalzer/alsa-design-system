/**
 * Swedish translations for Heading component
 */

export const headingTranslations_sv = {
  displayName: 'Rubrik',
  description: 'Rubrikkomponent för struktur och hierarki',
  defaultContent: 'Rubrik',
  
  props: {
    content: {
      displayName: 'Innehåll',
      description: 'Rubriktext',
    },
    variant: {
      displayName: 'Variant',
      description: 'Rubriknivå och storlek',
      valueLabels: {
        'display-2xl': 'Display 2XL',
        'display-xl': 'Display XL',
        'display-lg': 'Display L',
        'display-md': 'Display M',
        'display-sm': 'Display S',
        h1: 'Rubrik 1',
        h2: 'Rubrik 2',
        h3: 'Rubrik 3',
        h4: 'Rubrik 4',
        h5: 'Rubrik 5',
        h6: 'Rubrik 6',
      },
    },
    weight: {
      displayName: 'Vikt',
      description: 'Textvikt',
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
        justify: 'Justera',
      },
    },
  },
};
