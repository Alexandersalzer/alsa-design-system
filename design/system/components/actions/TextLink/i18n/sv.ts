/**
 * Swedish translations for TextLink component
 */

export const textLinkTranslations_sv = {
  displayName: 'Textlänk',
  description: 'En semantisk länk med olika stilar och ikoner för navigering',
  
  props: {
    content: {
      displayName: 'Text',
      description: 'Texten som visas i länken',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visuell stil för länken',
      valueLabels: {
        primary: 'Primär',
        secondary: 'Sekundär',
        accent: 'Accent',
        ghost: 'Spöke',
        'button-ghost': 'Knapp-spöke',
        brand: 'Varumärke',
        inverse: 'Inverterad',
      },
    },
    size: {
      displayName: 'Storlek',
      description: 'Storleken på länktexten',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
        xl: 'Extra stor',
      },
    },
    weight: {
      displayName: 'Textvikt',
      description: 'Tjockleken på texten',
      valueLabels: {
        regular: 'Normal',
        medium: 'Medium',
        semibold: 'Halvfet',
        bold: 'Fet',
      },
    },
    underline: {
      displayName: 'Understrykning',
      description: 'När länken ska understrykas',
      valueLabels: {
        none: 'Aldrig',
        hover: 'Vid hovring',
        always: 'Alltid',
      },
    },
    href: {
      displayName: 'URL',
      description: 'Länkens destination (URL)',
    },
    action: {
      displayName: 'Åtgärd',
      description: 'Navigationåtgärd när länken klickas',
    },
    disabled: {
      displayName: 'Inaktiverad',
      description: 'Gör länken oinaktiv',
    },
  },
  
  validation: {
    'content-not-empty': 'Länktext får inte vara tom',
    'href-or-action': 'Antingen href eller action måste anges',
  },
  
  examples: {
    'simple-link': {
      name: 'Enkel länk',
      description: 'Grundläggande textlänk',
      category: 'common',
    },
    'with-icon': {
      name: 'Med ikon',
      description: 'Länk med ikon',
      category: 'common',
    },
    'underlined': {
      name: 'Understruken',
      description: 'Länk med understrykning',
      category: 'common',
    },
  },
};
