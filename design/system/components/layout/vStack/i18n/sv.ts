/**
 * Swedish translations for VStack component
 */

export const vStackTranslations_sv = {
  displayName: 'Vertikal Stack',
  description: 'Vertikal layoutcontainer för att arrangera element i kolumn',
  
  props: {
    spacing: {
      displayName: 'Mellanrum',
      description: 'Utrymme mellan element',
      valueLabels: {
        none: 'Inget',
        xs: 'Extra litet',
        sm: 'Litet',
        md: 'Medium',
        lg: 'Stort',
        xl: 'Extra stort',
        '2xl': '2X Stort',
        '3xl': '3X Stort',
      },
    },
    align: {
      displayName: 'Horisontell justering',
      description: 'Hur element justeras horisontellt',
      valueLabels: {
        start: 'Vänster',
        center: 'Center',
        end: 'Höger',
        stretch: 'Sträck',
      },
    },
    justify: {
      displayName: 'Vertikal fördelning',
      description: 'Hur element fördelas vertikalt',
      valueLabels: {
        start: 'Topp',
        center: 'Center',
        end: 'Botten',
        between: 'Mellan',
        around: 'Runt',
        evenly: 'Jämnt',
      },
    },
    fullWidth: {
      displayName: 'Full bredd',
      description: 'Ta hela tillgänglig bredd',
    },
  },
};
