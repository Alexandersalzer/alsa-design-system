/**
 * Swedish translations for Slider component
 */

export const sliderTranslations_sv = {
  displayName: 'Skjutreglage',
  description: 'Skjutreglage för val av numeriskt värde',
  
  props: {
    label: {
      displayName: 'Etikett',
      description: 'Etiketttext för skjutreglaget',
    },
    size: {
      displayName: 'Storlek',
      description: 'Skjutreglagets storlek',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    color: {
      displayName: 'Färg',
      description: 'Färgvariant',
      valueLabels: {
        primary: 'Primär',
        secondary: 'Sekundär',
        success: 'Framgång',
        warning: 'Varning',
        danger: 'Fara',
      },
    },
    showSteps: {
      displayName: 'Visa steg',
      description: 'Visa stegmarkörer',
    },
    showTooltip: {
      displayName: 'Visa tooltip',
      description: 'Visa tooltip med värde vid hovring',
    },
    disabled: {
      displayName: 'Inaktiverad',
      description: 'Inaktivera skjutreglaget',
    },
  },
};
