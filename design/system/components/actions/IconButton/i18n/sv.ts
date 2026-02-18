/**
 * Swedish translations for IconButton component
 */

export const iconButtonTranslations_sv = {
  displayName: 'Ikonknapp',
  description: 'En knapp som visar endast en ikon, ofta använd för åtgärder i verktygsfält och kompakta gränssnitt',
  
  props: {
    icon: {
      displayName: 'Ikon',
      description: 'Ikonen som ska visas i knappen',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visuell stil för knappen',
      valueLabels: {
        primary: 'Primär',
        secondary: 'Sekundär',
        accent: 'Accent',
        ghost: 'Spöke',
        destructive: 'Destruktiv',
      },
    },
    size: {
      displayName: 'Storlek',
      description: 'Storleken på knappen',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
        xl: 'Extra stor',
      },
    },
    badge: {
      displayName: 'Badge',
      description: 'Visar ett badge med siffra eller text (t.ex. notifikationer)',
    },
    ariaLabel: {
      displayName: 'Tillgänglighetsetikett',
      description: 'Beskrivande text för skärmläsare (obligatorisk)',
    },
    tooltip: {
      displayName: 'Visa tooltip',
      description: 'Aktivera tooltip vid hovring',
    },
    tooltipContent: {
      displayName: 'Tooltip-innehåll',
      description: 'Anpassat innehåll för tooltip (använder aria-label om inte angiven)',
    },
    loading: {
      displayName: 'Laddning',
      description: 'Visar laddningsindikator',
    },
    disabled: {
      displayName: 'Inaktiverad',
      description: 'Gör knappen oinaktiv',
    },
  },
  
  validation: {
    'icon-required': 'En ikon måste anges',
    'aria-label-required': 'Tillgänglighetsetikett (aria-label) är obligatorisk',
  },
  
  examples: {
    'edit-button': {
      name: 'Redigeringsknapp',
      description: 'Knapp för att redigera innehåll',
      category: 'common',
    },
    'delete-button': {
      name: 'Raderingsknapp',
      description: 'Destruktiv knapp för att radera',
      category: 'common',
    },
    'with-badge': {
      name: 'Med badge',
      description: 'Knapp med notifikationsbadge',
      category: 'notifications',
    },
    'with-tooltip': {
      name: 'Med tooltip',
      description: 'Knapp med tooltip vid hovring',
      category: 'common',
    },
  },
};
