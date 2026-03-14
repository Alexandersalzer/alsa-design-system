/**
 * Swedish translations for LogoText component
 */

export const logotextTranslations_sv = {
  displayName: 'Logotyp text',
  description: 'Brandad text för logotyper och rubriker',
  
  props: {
    content: {
      displayName: 'Text',
      description: 'Textinnehåll för logotypen',
    },
    size: {
      displayName: 'Storlek',
      description: 'Textstorlek',
      valueLabels: {
        xs: 'Extra liten',
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
        xl: 'Extra stor',
        '2xl': 'Dubbel extra stor',
      },
    },
    weight: {
      displayName: 'Tjocklek',
      description: 'Typsnittsvikt',
      valueLabels: {
        normal: 'Normal',
        medium: 'Medium',
        semibold: 'Halvfet',
        bold: 'Fet',
        extrabold: 'Extra fet',
        black: 'Svart',
      },
    },
    transform: {
      displayName: 'Texttransform',
      description: 'Skiftlägestransformering',
      valueLabels: {
        none: 'Ingen',
        uppercase: 'Versaler',
        lowercase: 'Gemener',
        capitalize: 'Inledande versal',
      },
    },
    spacing: {
      displayName: 'Bokstavsavstånd',
      description: 'Avstånd mellan bokstäver',
      valueLabels: {
        normal: 'Normal',
        tight: 'Tätt',
        wide: 'Brett',
        wider: 'Bredare',
        widest: 'Bredast',
      },
    },
    color: {
      displayName: 'Färg',
      description: 'Färgvariant',
      valueLabels: {
        auto: 'Auto',
        'auto-inverse': 'Auto+',
        inverse: 'Inverterad',
        primary: 'Primär',
        secondary: 'Sekundär',
        inherit: 'Ärvd',
      },
    },
    font: {
      displayName: 'Typsnitt',
      description: 'Typsnittsfamilj',
      valueLabels: {
        brand: 'Varumärke',
        heading: 'Rubrik',
        body: 'Brödtext',
        mono: 'Monospace',
      },
    },
    gradient: {
      displayName: 'Gradient',
      description: 'Aktivera gradienteffekt',
    },
    gradientDirection: {
      displayName: 'Gradientriktning',
      description: 'Riktning för gradient',
      valueLabels: {
        'to-r': 'Till höger',
        'to-br': 'Till nedre höger',
        'to-b': 'Till botten',
        'to-bl': 'Till nedre vänster',
        'to-l': 'Till vänster',
      },
    },
    hover: {
      displayName: 'Hover-effekt',
      description: 'Aktivera hover-effekt',
    },
  },
};
