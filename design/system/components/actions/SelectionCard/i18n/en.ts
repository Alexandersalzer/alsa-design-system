/**
 * English translations for SelectionCard component
 */

export const selectionCardTranslations_en = {
  displayName: 'Selection Card',
  description: 'An interactive card for selecting options, with support for checkbox, radio, or visual feedback',
  
  props: {
    selected: {
      displayName: 'Selected',
      description: 'Whether the card is selected',
    },
    indicator: {
      displayName: 'Indicator',
      description: 'Type of selection indicator',
      valueLabels: {
        none: 'None',
        checkbox: 'Checkbox',
        radio: 'Radio',
      },
    },
    orientation: {
      displayName: 'Orientation',
      description: 'Layout orientation',
      valueLabels: {
        horizontal: 'Horizontal',
        vertical: 'Vertical',
      },
    },
    size: {
      displayName: 'Size',
      description: 'Card size',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    variant: {
      displayName: 'Variant',
      description: 'Color variant',
      valueLabels: {
        neutral: 'Neutral',
        accent: 'Accent',
      },
    },
    disabled: {
      displayName: 'Disabled',
      description: 'Disable card selection',
    },
  },
};
