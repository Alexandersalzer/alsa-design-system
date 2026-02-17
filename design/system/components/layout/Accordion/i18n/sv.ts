/**
 * Swedish translations for Accordion component
 */

export const accordionTranslations_sv = {
  displayName: 'Dragspel',
  description: 'Vertikalt staplade hopfällbara sektioner',
  
  props: {
    selectionMode: {
      displayName: 'Valläge',
      description: 'Hur många sektioner kan öppnas samtidigt',
      valueLabels: {
        single: 'En sektion',
        multiple: 'Flera sektioner',
      },
    },
    variant: {
      displayName: 'Variant',
      description: 'Visuell stil',
      valueLabels: {
        default: 'Standard',
        separated: 'Separerad',
        bordered: 'Kantad',
        sunken: 'Sänkt',
        borderless: 'Kantlös',
        list: 'Lista',
      },
    },
    radius: {
      displayName: 'Hörnradie',
      description: 'Rundade hörn',
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
    radiusMode: {
      displayName: 'Radieläge',
      description: 'Hur radie appliceras',
      valueLabels: {
        edges: 'Kanter',
        all: 'Alla',
        none: 'Ingen',
      },
    },
    gap: {
      displayName: 'Mellanrum',
      description: 'Utrymme mellan element',
      valueLabels: {
        none: 'Inget',
        xs: 'Extra litet',
        sm: 'Litet',
        md: 'Medium',
        lg: 'Stort',
      },
    },
    size: {
      displayName: 'Storlek',
      description: 'Storlek på padding och mellanrum',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    showIndicator: {
      displayName: 'Visa indikator',
      description: 'Visa/dölj chevron-indikatorer',
    },
  },
};
