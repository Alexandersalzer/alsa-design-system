/**
 * Swedish translations for Radio component
 */

export const radioTranslations_sv = {
  displayName: 'Radioknapp',
  description: 'Radioknapp för val av ett alternativ från en grupp',
  
  props: {
    label: {
      displayName: 'Etikett',
      description: 'Etiketttext för radioknappen',
    },
    description: {
      displayName: 'Beskrivning',
      description: 'Hjälptext under etiketten',
    },
    size: {
      displayName: 'Storlek',
      description: 'Radioknappens storlek',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    checked: {
      displayName: 'Vald',
      description: 'Om radioknappen är vald',
    },
    disabled: {
      displayName: 'Inaktiverad',
      description: 'Inaktivera radioknappen',
    },
    required: {
      displayName: 'Obligatorisk',
      description: 'Markera som obligatorisk',
    },
  },
};
