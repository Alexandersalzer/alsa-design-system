/**
 * Swedish translations for Checkbox component
 */

export const checkboxTranslations_sv = {
  displayName: 'Kryssruta',
  description: 'Kryssruta för val av ja/nej alternativ',
  
  props: {
    label: {
      displayName: 'Etikett',
      description: 'Etiketttext för kryssrutan',
    },
    description: {
      displayName: 'Beskrivning',
      description: 'Hjälptext under etiketten',
    },
    error: {
      displayName: 'Felmeddelande',
      description: 'Felmeddelande att visa',
    },
    size: {
      displayName: 'Storlek',
      description: 'Kryssrutans storlek',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    indeterminate: {
      displayName: 'Obestämd',
      description: 'Obestämt tillstånd (delvis vald)',
    },
    checked: {
      displayName: 'Vald',
      description: 'Om kryssrutan är vald',
    },
    disabled: {
      displayName: 'Inaktiverad',
      description: 'Inaktivera kryssrutan',
    },
    required: {
      displayName: 'Obligatorisk',
      description: 'Markera som obligatorisk',
    },
  },
};
