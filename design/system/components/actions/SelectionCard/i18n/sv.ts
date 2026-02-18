/**
 * Swedish translations for SelectionCard component
 */

export const selectionCardTranslations_sv = {
  displayName: 'Valbart kort',
  description: 'Ett interaktivt kort för att välja alternativ, med stöd för checkbox, radio eller visuell feedback',
  
  props: {
    selected: {
      displayName: 'Vald',
      description: 'Om kortet är valt',
    },
    indicator: {
      displayName: 'Indikator',
      description: 'Typ av valindikator',
      valueLabels: {
        none: 'Ingen',
        checkbox: 'Kryssruta',
        radio: 'Radioknapp',
      },
    },
    orientation: {
      displayName: 'Orientering',
      description: 'Layout-orientering',
      valueLabels: {
        horizontal: 'Horisontell',
        vertical: 'Vertikal',
      },
    },
    size: {
      displayName: 'Storlek',
      description: 'Kortets storlek',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    variant: {
      displayName: 'Variant',
      description: 'Färgvariant',
      valueLabels: {
        neutral: 'Neutral',
        accent: 'Accent',
      },
    },
    disabled: {
      displayName: 'Inaktiverad',
      description: 'Inaktivera kortval',
    },
  },
};
