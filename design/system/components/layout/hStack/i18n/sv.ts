/**
 * Swedish translations for HStack component
 */

export const hStackTranslations_sv = {
  displayName: 'Horisontell Stack',
  description: 'Horisontell layoutcontainer för att arrangera element i rad',
  
  props: {
    spacing: {
      displayName: 'Mellanrum',
      description: 'Utrymme mellan element',
      valueLabels: {
        xs: 'Extra litet',
        sm: 'Litet',
        md: 'Medium',
        lg: 'Stort',
        xl: 'Extra stort',
      },
    },
    align: {
      displayName: 'Vertikal justering',
      description: 'Hur element justeras vertikalt',
      valueLabels: {
        start: 'Topp',
        center: 'Center',
        end: 'Botten',
        baseline: 'Baslinje',
        stretch: 'Sträck',
      },
    },
    justify: {
      displayName: 'Horisontell fördelning',
      description: 'Hur element fördelas horisontellt',
      valueLabels: {
        start: 'Start',
        center: 'Center',
        end: 'Slut',
        between: 'Mellan',
        around: 'Runt',
        evenly: 'Jämnt',
      },
    },
    wrap: {
      displayName: 'Radbrytning',
      description: 'Om element ska brytas till ny rad',
    },
  },
};
