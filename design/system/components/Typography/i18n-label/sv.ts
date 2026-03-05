/**
 * Swedish translations for Label component
 */

export const labelTranslations_sv = {
  displayName: 'Etikett',
  description: 'Liten text för etiketter och beskrivningar',
  defaultContent: 'Etikett',
  
  props: {
    content: {
      displayName: 'Innehåll',
      description: 'Texten som ska visas',
    },
    size: {
      displayName: 'Storlek',
      description: 'Etikettstorlek',
      valueLabels: {
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
        regular: 'Normal',
        medium: 'Medium',
        semibold: 'Halvfet',
        bold: 'Fet',
      },
    },
  },
};
