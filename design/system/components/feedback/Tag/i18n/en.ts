/**
 * English translations for Tag component
 */

export const tagTranslations_en = {
  displayName: 'Tag',
  description: 'Label for categories, status or filters',
  
  props: {
    children: {
      displayName: 'Text',
      description: 'Tag text content',
    },
    variant: {
      displayName: 'Variant',
      description: 'Color variant',
      valueLabels: {
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info',
        accent: 'Accent',
        default: 'Default',
      },
    },
    size: {
      displayName: 'Size',
      description: 'Tag size',
      valueLabels: {
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
      },
    },
    surface: {
      displayName: 'Surface',
      description: 'Surface prominence',
      valueLabels: {
        subtle: 'Subtle',
        muted: 'Muted',
        vibrant: 'Vibrant',
      },
    },
  },
};
