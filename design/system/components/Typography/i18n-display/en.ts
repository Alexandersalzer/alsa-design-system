/**
 * English translations for Display component
 */

export const displayTranslations_en = {
  displayName: 'Display Text',
  description: 'Extra large display text for headings and hero sections',
  
  props: {
    content: {
      displayName: 'Content',
      description: 'The text to display',
    },
    size: {
      displayName: 'Size',
      description: 'Display size',
      valueLabels: {
        xl: 'Extra Large',
        lg: 'Large',
        md: 'Medium',
        sm: 'Small',
      },
    },
    color: {
      displayName: 'Color',
      description: 'Text color',
    },
    weight: {
      displayName: 'Weight',
      description: 'Font weight',
      valueLabels: {
        light: 'Light',
        regular: 'Regular',
        medium: 'Medium',
        semibold: 'Semibold',
        bold: 'Bold',
        extrabold: 'Extra Bold',
        black: 'Black',
      },
    },
    align: {
      displayName: 'Alignment',
      description: 'Text alignment',
      valueLabels: {
        left: 'Left',
        center: 'Center',
        right: 'Right',
        justify: 'Justify',
      },
    },
    animation: {
      displayName: 'Animation',
      description: 'Animation settings for display text',
      props: {
        type: {
          displayName: 'Animation Type',
          description: 'Type of animation',
          valueLabels: {
            countUp: 'Count Up',
            none: 'None',
          },
        },
        settings: {
          displayName: 'CountUp Settings',
          description: 'Settings for count up animation',
          props: {
            start: {
              displayName: 'Start Value',
              description: 'The value to start counting from',
            },
            end: {
              displayName: 'End Value',
              description: 'The value to count to',
            },
            suffix: {
              displayName: 'Suffix',
              description: 'Character after the number',
              valueLabels: {
                '': 'None',
                '+': '+',
                'k+': 'k+',
                '%': '%',
                'kr': 'kr',
              },
            },
            duration: {
              displayName: 'Duration',
              description: 'Animation duration in milliseconds',
            },
            enableScrollTrigger: {
              displayName: 'Enable Scroll Trigger',
              description: 'Start animation when element is visible',
            },
            triggerOffset: {
              displayName: 'Trigger Offset',
              description: 'Pixels from bottom of viewport',
            },
          },
        },
      },
    },
  },
};
