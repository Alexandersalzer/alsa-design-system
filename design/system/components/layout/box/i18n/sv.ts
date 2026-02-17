/**
 * Swedish translations for Box component
 */

export const boxTranslations_sv = {
  displayName: 'Box',
  description: 'Grundläggande layout-primitiv med flexibel styling',
  
  props: {
    padding: {
      displayName: 'Inre marginal',
      description: 'Utrymme inuti boxen',
      valueLabels: {
        none: 'Ingen',
        xs: 'Extra liten',
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
        xl: 'Extra stor',
        '2xl': '2X Stor',
      },
    },
    radius: {
      displayName: 'Hörnradie',
      description: 'Rundade hörn',
      valueLabels: {
        none: 'Ingen',
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
        xl: 'Extra stor',
        full: 'Full',
      },
    },
    bg: {
      displayName: 'Bakgrund',
      description: 'Bakgrundsfärg',
      valueLabels: {
        base: 'Bas',
        card: 'Kort',
        hover: 'Hover',
        sidebar: 'Sidebar',
        nav: 'Navigation',
        transparent: 'Transparent',
      },
    },
    border: {
      displayName: 'Ram',
      description: 'Kantlinje',
      valueLabels: {
        none: 'Ingen',
        light: 'Ljus',
        default: 'Standard',
        heavy: 'Tjock',
      },
    },
  },
};
