/**
 * Swedish translations for Grid component
 */

export const gridTranslations_sv = {
  displayName: 'Rutnät',
  description: 'Responsivt rutnätssystem för layouter',
  
  props: {
    columns: {
      displayName: 'Kolumner',
      description: 'Antal kolumner',
    },
    spacing: {
      displayName: 'Mellanrum',
      description: 'Utrymme mellan celler',
      valueLabels: {
        none: 'Inget',
        xs: 'Extra litet',
        sm: 'Litet',
        md: 'Medium',
        lg: 'Stort',
        xl: 'Extra stort',
      },
    },
    cardDensity: {
      displayName: 'Korttäthet',
      description: 'Automatisk kolumnstorlek baserad på täthet',
      valueLabels: {
        compact: 'Kompakt',
        standard: 'Standard',
        spacious: 'Rymlig',
      },
    },
  },
};
