/**
 * English translations for Badge component
 */

export const badgeTranslations_en = {
  displayName: 'Badge',
  description: 'Indicator for notifications and status',
  
  props: {
    content: {
      displayName: 'Content',
      description: 'Badge content (number or text)',
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
      description: 'Badge size',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    placement: {
      displayName: 'Placement',
      description: 'Where badge is positioned',
      valueLabels: {
        'top-right': 'Top Right',
        'top-left': 'Top Left',
        'bottom-right': 'Bottom Right',
        'bottom-left': 'Bottom Left',
      },
    },
    isDot: {
      displayName: 'Dot',
      description: 'Show as dot without content',
    },
  },
};
