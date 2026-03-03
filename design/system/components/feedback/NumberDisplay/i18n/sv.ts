/**
 * Swedish translations for NumberDisplay component
 */

export const numberDisplayTranslations_sv = {
  displayName: 'Sifferdisplay',
  description: 'Visar siffror med button-liknande varianter',

  props: {
    value: {
      displayName: 'Värde',
      description: 'Siffran eller texten som visas',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visuell stil',
      valueLabels: {
        brand: 'Varumärke',
        primary: 'Primär',
        secondary: 'Sekundär',
        accent: 'Accent',
        ghost: 'Ghost',
        raised: 'Upphöjd',
        bare: 'Utan ram',
      },
    },
    size: {
      displayName: 'Storlek',
      description: 'Displayens storlek',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
        xl: 'Extra stor',
      },
    },
    shape: {
      displayName: 'Form',
      description: 'Kanternas rundning',
      valueLabels: {
        square: 'Kvadrat',
        rounded: 'Rundad',
        circle: 'Cirkel',
      },
    },
  },
};
