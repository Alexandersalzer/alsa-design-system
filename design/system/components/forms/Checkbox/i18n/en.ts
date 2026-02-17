/**
 * English translations for Checkbox component
 */

export const checkboxTranslations_en = {
  displayName: 'Checkbox',
  description: 'Checkbox for yes/no options',
  
  props: {
    label: {
      displayName: 'Label',
      description: 'Label text for the checkbox',
    },
    description: {
      displayName: 'Description',
      description: 'Helper text below the label',
    },
    error: {
      displayName: 'Error Message',
      description: 'Error message to display',
    },
    size: {
      displayName: 'Size',
      description: 'Checkbox size',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    indeterminate: {
      displayName: 'Indeterminate',
      description: 'Indeterminate state (partially selected)',
    },
    checked: {
      displayName: 'Checked',
      description: 'Whether the checkbox is checked',
    },
    disabled: {
      displayName: 'Disabled',
      description: 'Disable the checkbox',
    },
    required: {
      displayName: 'Required',
      description: 'Mark as required',
    },
  },
};
