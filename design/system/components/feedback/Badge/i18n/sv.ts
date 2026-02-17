/**
 * Swedish translations for Badge component
 */

export const badgeTranslations_sv = {
  displayName: 'Märke',
  description: 'Indikator för notifikationer och status',
  
  props: {
    content: {
      displayName: 'Innehåll',
      description: 'Märkets innehåll (nummer eller text)',
    },
    variant: {
      displayName: 'Variant',
      description: 'Färgvariant',
      valueLabels: {
        success: 'Framgång',
        error: 'Fel',
        warning: 'Varning',
        info: 'Info',
        accent: 'Accent',
        default: 'Standard',
      },
    },
    size: {
      displayName: 'Storlek',
      description: 'Märkets storlek',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    placement: {
      displayName: 'Placering',
      description: 'Var märket placeras',
      valueLabels: {
        'top-right': 'Höger topp',
        'top-left': 'Vänster topp',
        'bottom-right': 'Höger botten',
        'bottom-left': 'Vänster botten',
      },
    },
    isDot: {
      displayName: 'Punkt',
      description: 'Visa som punkt utan innehåll',
    },
  },
};
