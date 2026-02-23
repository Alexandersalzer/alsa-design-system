/**
 * Swedish translations for CountUp component
 */

export const countUpTranslations_sv = {
  displayName: 'Räknare',
  description: 'Animerad siffra som räknar upp till ett värde',
  
  props: {
    start: {
      displayName: 'Startvärde',
      description: 'Värdet att börja räkna från',
    },
    end: {
      displayName: 'Slutvärde',
      description: 'Värdet att räkna till',
    },
    suffix: {
      displayName: 'Suffix',
      description: 'Tecken efter numret',
      valueLabels: {
        '': 'Inget',
        '+': '+',
        'k+': 'k+',
        '%': '%',
        'kr': 'kr',
      },
    },
    duration: {
      displayName: 'Varaktighet',
      description: 'Animationens längd i millisekunder',
    },
    enableScrollTrigger: {
      displayName: 'Aktivera scroll-trigger',
      description: 'Starta animation när elementet syns',
    },
    triggerOffset: {
      displayName: 'Trigger-offset',
      description: 'Pixlar från botten av viewporten',
    },
    variant: {
      displayName: 'Variant',
      description: 'Typografi-variant för siffran',
      valueLabels: {
        'display-xl': 'Display XL',
        'display-lg': 'Display L',
        'display-md': 'Display M',
        'display-sm': 'Display S',
        'h1': 'Rubrik 1',
        'h2': 'Rubrik 2',
        'h3': 'Rubrik 3',
        'body-xl': 'Brödtext XL',
        'body-lg': 'Brödtext L',
      },
    },
    size: {
      displayName: 'Storlek',
      description: 'Textstorlek',
      valueLabels: {
        xl: 'Extra stor',
        lg: 'Stor',
        md: 'Medium',
        sm: 'Liten',
      },
    },
    weight: {
      displayName: 'Vikt',
      description: 'Typsnittsvikt',
      valueLabels: {
        light: 'Lätt',
        regular: 'Normal',
        medium: 'Medium',
        semibold: 'Halvfet',
        bold: 'Fet',
        extrabold: 'Extra fet',
        black: 'Svart',
      },
    },
    color: {
      displayName: 'Färg',
      description: 'Textfärg',
      valueLabels: {
        primary: 'Primär',
        secondary: 'Sekundär',
        heading: 'Rubrik',
        body: 'Brödtext',
        accent: 'Accent',
        brand: 'Varumärke',
        success: 'Framgång',
        warning: 'Varning',
        error: 'Fel',
      },
    },
    align: {
      displayName: 'Justering',
      description: 'Textjustering',
      valueLabels: {
        left: 'Vänster',
        center: 'Center',
        right: 'Höger',
      },
    },
  },
};
