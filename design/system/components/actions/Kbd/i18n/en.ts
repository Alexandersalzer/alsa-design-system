/**
 * English translations for Kbd component
 */

export const kbdTranslations_en = {
  displayName: 'Keyboard Key',
  description: 'Display keyboard shortcuts with button-like styling',
  
  props: {
    keys: {
      displayName: 'Modifiers',
      description: 'Array of modifier keys (e.g., ["command", "shift"])',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visual style variant',
      valueLabels: {
        secondary: 'Secondary',
        ghost: 'Ghost',
        primary: 'Primary',
      },
    },
  },
};
