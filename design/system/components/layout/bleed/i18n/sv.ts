/**
 * Swedish translations for Bleed component
 */

export const bleedTranslations_sv = {
  displayName: 'Bleed',
  description: 'Låter innehåll flöda utanför sin container',
  
  props: {
    amount: {
      displayName: 'Belopp',
      description: 'Hur mycket som flödar ut på alla sidor',
    },
    horizontal: {
      displayName: 'Horisontellt',
      description: 'Bleed på vänster och höger sida',
    },
    vertical: {
      displayName: 'Vertikalt',
      description: 'Bleed på topp och botten',
    },
    disableOnMobile: {
      displayName: 'Inaktivera på mobil',
      description: 'Återställ marginaler till 0 på mobila enheter',
    },
  },
};
