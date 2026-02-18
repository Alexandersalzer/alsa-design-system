/**
 * Swedish translations for Kbd component
 */

export const kbdTranslations_sv = {
  displayName: 'Tangentbordsknapp',
  description: 'Visar tangentbordsgenvägar med knappliknande styling',
  
  props: {
    keys: {
      displayName: 'Modifierare',
      description: 'Array av modifierartangenter (t.ex. ["command", "shift"])',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visuell stilvariant',
      valueLabels: {
        secondary: 'Sekundär',
        ghost: 'Ghost',
        primary: 'Primär',
      },
    },
  },
};
