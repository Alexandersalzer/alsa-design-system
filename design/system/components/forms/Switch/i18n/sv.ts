/**
 * Swedish translations for Switch component
 */

export const switchTranslations_sv = {
  displayName: 'Växlare',
  description: 'Växlare för på/av-alternativ',
  
  props: {
    label: {
      displayName: 'Etikett',
      description: 'Etiketttext för växlaren',
    },
    description: {
      displayName: 'Beskrivning',
      description: 'Hjälptext under växlaren',
    },
    error: {
      displayName: 'Felmeddelande',
      description: 'Felmeddelande att visa',
    },
    success: {
      displayName: 'Framgångsmeddelande',
      description: 'Framgångsmeddelande att visa',
    },
    size: {
      displayName: 'Storlek',
      description: 'Växlarens storlek',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    labelPosition: {
      displayName: 'Etikettposition',
      description: 'Var etiketten placeras',
      valueLabels: {
        left: 'Vänster',
        right: 'Höger',
      },
    },
    checked: {
      displayName: 'På',
      description: 'Om växlaren är på',
    },
    disabled: {
      displayName: 'Inaktiverad',
      description: 'Inaktivera växlaren',
    },
    required: {
      displayName: 'Obligatorisk',
      description: 'Markera som obligatorisk',
    },
  },
};
