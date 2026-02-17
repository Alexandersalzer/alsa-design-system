/**
 * Swedish translations for Clickable component
 */

export const clickableTranslations_sv = {
  displayName: 'Klickbar behållare',
  description: 'En generisk interaktiv behållare med anpassningsbara stilar och tillstånd',
  
  props: {
    as: {
      displayName: 'Element-typ',
      description: 'HTML-element att rendera som',
    },
    variant: {
      displayName: 'Variant',
      description: 'Kontrollerar hover/selection-beteende',
      valueLabels: {
        default: 'Standard',
        bordered: 'Endast ram',
      },
    },
    padding: {
      displayName: 'Padding',
      description: 'Inre avstånd',
    },
    borderRadius: {
      displayName: 'Hörnavrundning',
      description: 'Avrundning av hörn',
    },
    background: {
      displayName: 'Bakgrund',
      description: 'Bakgrundsfärg',
      valueLabels: {
        transparent: 'Transparent',
        subdued: 'Dämpad',
        card: 'Kort',
        hover: 'Hover',
        selected: 'Vald',
      },
    },
    border: {
      displayName: 'Ram',
      description: 'Ramstil',
      valueLabels: {
        none: 'Ingen',
        base: 'Bas',
        strong: 'Stark',
        subtle: 'Subtil',
      },
    },
    interactive: {
      displayName: 'Interaktiv',
      description: 'Aktivera interaktiva stilar',
    },
    selected: {
      displayName: 'Vald',
      description: 'Visuellt valt tillstånd',
    },
    disabled: {
      displayName: 'Inaktiverad',
      description: 'Inaktivera interaktion',
    },
    loading: {
      displayName: 'Laddning',
      description: 'Visar laddningstillstånd',
    },
  },
};
