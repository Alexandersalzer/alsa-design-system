/**
 * English translations for SegmentedControl component
 */

export const segmentedControlTranslations_en = {
  displayName: 'Segmented Control',
  description: 'A control for selecting between multiple options with visual feedback',
  
  props: {
    options: {
      displayName: 'Options',
      description: 'List of selectable options',
    },
    value: {
      displayName: 'Selected Value',
      description: 'Currently selected value',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visual style',
      valueLabels: {
        default: 'Default',
        raised: 'Raised',
        accent: 'Accent',
        pill: 'Pill',
        ghost: 'Ghost',
      },
    },
    size: {
      displayName: 'Size',
      description: 'Size of the control',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    fullWidth: {
      displayName: 'Full Width',
      description: 'Make control full width',
    },
    iconOnly: {
      displayName: 'Icon Only',
      description: 'Show only icons with tooltips',
    },
    disabled: {
      displayName: 'Disabled',
      description: 'Disable the control',
    },
  },
};
