/**
 * Swedish translations for Display component
 */

export const displayTranslations_sv = {
  displayName: 'Display-text',
  description: 'Extra stor display-text för rubriker och hero-sektioner',
  defaultContent: 'Din stora rubrik',
  
  props: {
    content: {
      displayName: 'Innehåll',
      description: 'Texten som ska visas',
    },
    size: {
      displayName: 'Storlek',
      description: 'Display-storlek',
      valueLabels: {
        xl: 'Extra stor',
        lg: 'Stor',
        md: 'Medium',
        sm: 'Liten',
      },
    },
    color: {
      displayName: 'Färg',
      description: 'Textfärg',
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
    align: {
      displayName: 'Justering',
      description: 'Textjustering',
      valueLabels: {
        left: 'Vänster',
        center: 'Center',
        right: 'Höger',
        justify: 'Marginaljusterad',
      },
    },
    animation: {
      displayName: 'Animation',
      description: 'Animationsinställningar för display-text',
      props: {
        type: {
          displayName: 'Animationstyp',
          description: 'Typ av animation',
          valueLabels: {
            countUp: 'Räkna upp',
            none: 'Ingen',
          },
        },
        settings: {
          displayName: 'CountUp-inställningar',
          description: 'Inställningar för uppräkningsanimation',
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
          },
        },
      },
    },
  },
};
