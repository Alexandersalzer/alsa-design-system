/**
 * Swedish translations for BentoGrid component
 */

export const bentoGridTranslations_sv = {
  displayName: 'Bento-rutnät',
  description: 'Flexibelt rutnät för komplexa layouter',
  
  props: {
    columns: {
      displayName: 'Kolumner',
      description: 'Antal kolumner (1-12)',
    },
    gap: {
      displayName: 'Mellanrum',
      description: 'Utrymme mellan element',
      valueLabels: {
        xs: 'Extra litet',
        sm: 'Litet',
        md: 'Medium',
        lg: 'Stort',
        xl: 'Extra stort',
        '2xl': '2X Stort',
      },
    },
    alignItems: {
      displayName: 'Vertikal justering',
      description: 'Hur element justeras vertikalt',
      valueLabels: {
        start: 'Topp',
        center: 'Center',
        end: 'Botten',
        stretch: 'Sträck',
      },
    },
  },
};
