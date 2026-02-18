/**
 * Swedish translations for SegmentedControl component
 */

export const segmentedControlTranslations_sv = {
  displayName: 'Segmenterad kontroll',
  description: 'En kontroll för att välja mellan flera alternativ med visuell feedback',
  
  props: {
    options: {
      displayName: 'Alternativ',
      description: 'Lista över valbara alternativ',
    },
    value: {
      displayName: 'Valt värde',
      description: 'Nuvarande valt värde',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visuell stil',
      valueLabels: {
        default: 'Standard',
        raised: 'Upphöjd',
        accent: 'Accent',
        pill: 'Piller',
        ghost: 'Spöke',
      },
    },
    size: {
      displayName: 'Storlek',
      description: 'Storleken på kontrollen',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    fullWidth: {
      displayName: 'Full bredd',
      description: 'Gör kontrollen full bredd',
    },
    iconOnly: {
      displayName: 'Endast ikoner',
      description: 'Visa endast ikoner med tooltips',
    },
    disabled: {
      displayName: 'Inaktiverad',
      description: 'Inaktivera kontrollen',
    },
  },
};
