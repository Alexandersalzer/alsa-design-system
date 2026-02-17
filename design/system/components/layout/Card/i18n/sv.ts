/**
 * Swedish translations for Card component
 */

export const cardTranslations_sv = {
  displayName: 'Kort',
  description: 'Container-komponent för att gruppera relaterat innehåll',
  
  props: {
    variant: {
      displayName: 'Variant',
      description: 'Visuell stilvariant',
      valueLabels: {
        default: 'Standard',
        raised: 'Upphöjd',
        elevated: 'Förhöjd',
        outlined: 'Omrissad',
        solid: 'Solid',
        ghost: 'Ghost',
        bordered: 'Kantad',
        'accent-subtle': 'Accent subtil',
        'accent-muted': 'Accent dämpad',
      },
    },
    padding: {
      displayName: 'Utfyllnad',
      description: 'Inre utfyllnad',
      valueLabels: {
        none: 'Ingen',
        xs: 'Extra liten',
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    radius: {
      displayName: 'Radie',
      description: 'Hörnradie',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    interactive: {
      displayName: 'Interaktiv',
      description: 'Om kortet är klickbart',
    },
  },
};
