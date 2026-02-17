/**
 * English translations for Slider component
 */

export const sliderTranslations_en = {
  displayName: 'Slider',
  description: 'Slider for selecting numeric values',
  
  props: {
    label: {
      displayName: 'Label',
      description: 'Label text for the slider',
    },
    size: {
      displayName: 'Size',
      description: 'Slider size',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    color: {
      displayName: 'Color',
      description: 'Color variant',
      valueLabels: {
        primary: 'Primary',
        secondary: 'Secondary',
        success: 'Success',
        warning: 'Warning',
        danger: 'Danger',
      },
    },
    showSteps: {
      displayName: 'Show Steps',
      description: 'Show step indicators',
    },
    showTooltip: {
      displayName: 'Show Tooltip',
      description: 'Show tooltip with value on hover',
    },
    disabled: {
      displayName: 'Disabled',
      description: 'Disable the slider',
    },
  },
};
