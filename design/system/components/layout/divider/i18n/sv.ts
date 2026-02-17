/**
 * Swedish translations for Divider component
 */

export const dividerTranslations_sv = {
  displayName: 'Avdelare',
  description: 'Visuell separator mellan sektioner',
  
  props: {
    orientation: {
      displayName: 'Orientering',
      description: 'Horisontell eller vertikal',
      valueLabels: {
        horizontal: 'Horisontell',
        vertical: 'Vertikal',
      },
    },
    weight: {
      displayName: 'Vikt',
      description: 'Visuell tjocklek',
      valueLabels: {
        default: 'Standard',
        strong: 'Stark',
        emphasis: 'Betoning',
        inverse: 'Inverterad',
      },
    },
    spacing: {
      displayName: 'Mellanrum',
      description: 'Utrymme runt avdelare',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    label: {
      displayName: 'Etikett',
      description: 'Valfri text i avdelare',
    },
    labelPosition: {
      displayName: 'Etikettposition',
      description: 'Var etiketten placeras',
      valueLabels: {
        left: 'Vänster',
        center: 'Center',
        right: 'Höger',
      },
    },
  },
};
