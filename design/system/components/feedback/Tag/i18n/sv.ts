/**
 * Swedish translations for Tag component
 */

export const tagTranslations_sv = {
  displayName: 'Tagg',
  description: 'Märkning för kategorier, status eller filter',
  defaultContent: 'Nyhet',
  
  props: {
    content: {
      displayName: 'Text',
      description: 'Taggens textinnehåll',
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
      description: 'Taggens storlek',
      valueLabels: {
        small: 'Liten',
        medium: 'Medium',
        large: 'Stor',
      },
    },
    surface: {
      displayName: 'Yta',
      description: 'Ytans framträdande',
      valueLabels: {
        subtle: 'Subtil',
        muted: 'Dämpad',
        vibrant: 'Livlig',
      },
    },
  },
};
