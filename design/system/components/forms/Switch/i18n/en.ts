/**
 * English translations for Switch component
 */

export const switchTranslations_en = {
  displayName: 'Switch',
  description: 'Switch for on/off options',
  
  props: {
    label: {
      displayName: 'Label',
      description: 'Label text for the switch',
    },
    description: {
      displayName: 'Description',
      description: 'Helper text below the switch',
    },
    error: {
      displayName: 'Error Message',
      description: 'Error message to display',
    },
    success: {
      displayName: 'Success Message',
      description: 'Success message to display',
    },
    size: {
      displayName: 'Size',
      description: 'Switch size',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    labelPosition: {
      displayName: 'Label Position',
      description: 'Where the label is placed',
      valueLabels: {
        left: 'Left',
        right: 'Right',
      },
    },
    checked: {
      displayName: 'On',
      description: 'Whether the switch is on',
    },
    disabled: {
      displayName: 'Disabled',
      description: 'Disable the switch',
    },
    required: {
      displayName: 'Required',
      description: 'Mark as required',
    },
  },
};
