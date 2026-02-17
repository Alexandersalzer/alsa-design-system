/**
 * English translations for Box component
 */

export const boxTranslations_en = {
  displayName: 'Box',
  description: 'Foundational layout primitive with flexible styling',
  
  props: {
    padding: {
      displayName: 'Padding',
      description: 'Space inside the box',
      valueLabels: {
        none: 'None',
        xs: 'Extra Small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
        '2xl': '2X Large',
      },
    },
    radius: {
      displayName: 'Border Radius',
      description: 'Rounded corners',
      valueLabels: {
        none: 'None',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
        full: 'Full',
      },
    },
    bg: {
      displayName: 'Background',
      description: 'Background color',
      valueLabels: {
        base: 'Base',
        card: 'Card',
        hover: 'Hover',
        sidebar: 'Sidebar',
        nav: 'Navigation',
        transparent: 'Transparent',
      },
    },
    border: {
      displayName: 'Border',
      description: 'Border line',
      valueLabels: {
        none: 'None',
        light: 'Light',
        default: 'Default',
        heavy: 'Heavy',
      },
    },
  },
};
