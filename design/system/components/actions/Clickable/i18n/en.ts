/**
 * English translations for Clickable component
 */

export const clickableTranslations_en = {
  displayName: 'Clickable Container',
  description: 'A generic interactive container with customizable styles and states',
  
  props: {
    as: {
      displayName: 'Element Type',
      description: 'HTML element to render as',
    },
    variant: {
      displayName: 'Variant',
      description: 'Controls hover/selection behavior',
      valueLabels: {
        default: 'Default',
        bordered: 'Border Only',
      },
    },
    padding: {
      displayName: 'Padding',
      description: 'Inner spacing',
    },
    borderRadius: {
      displayName: 'Border Radius',
      description: 'Corner rounding',
    },
    background: {
      displayName: 'Background',
      description: 'Background color',
      valueLabels: {
        transparent: 'Transparent',
        subdued: 'Subdued',
        card: 'Card',
        hover: 'Hover',
        selected: 'Selected',
      },
    },
    border: {
      displayName: 'Border',
      description: 'Border style',
      valueLabels: {
        none: 'None',
        base: 'Base',
        strong: 'Strong',
        subtle: 'Subtle',
      },
    },
    interactive: {
      displayName: 'Interactive',
      description: 'Enable interactive styles',
    },
    selected: {
      displayName: 'Selected',
      description: 'Visual selected state',
    },
    disabled: {
      displayName: 'Disabled',
      description: 'Disable interaction',
    },
    loading: {
      displayName: 'Loading',
      description: 'Shows loading state',
    },
  },
};
