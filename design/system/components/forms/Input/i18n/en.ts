/**
 * English translations for Input component
 */

export const inputTranslations_en = {
  displayName: 'Input',
  description: 'Text input field with support for various variants, icons, and validation',
  
  props: {
    label: {
      displayName: 'Label',
      description: 'Label text for the field',
    },
    placeholder: {
      displayName: 'Placeholder',
      description: 'Placeholder text when field is empty',
    },
    type: {
      displayName: 'Type',
      description: 'Input type',
      valueLabels: {
        text: 'Text',
        email: 'Email',
        password: 'Password',
        number: 'Number',
        tel: 'Phone',
        url: 'URL',
        search: 'Search',
      },
    },
    variant: {
      displayName: 'Variant',
      description: 'Visual style variant',
      valueLabels: {
        flat: 'Flat',
        bordered: 'Bordered',
        faded: 'Faded',
        underlined: 'Underlined',
        page: 'Page',
      },
    },
    size: {
      displayName: 'Size',
      description: 'Field size',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
      },
    },
    radius: {
      displayName: 'Radius',
      description: 'Corner radius',
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
        default: 'Default',
        primary: 'Primary',
        secondary: 'Secondary',
        success: 'Success',
        warning: 'Warning',
        danger: 'Danger',
      },
    },
    labelPlacement: {
      displayName: 'Label Placement',
      description: 'Where the label is positioned',
      valueLabels: {
        outside: 'Outside',
        'outside-left': 'Outside Left',
      },
    },
    error: {
      displayName: 'Error Message',
      description: 'Error message to display',
    },
    helper: {
      displayName: 'Helper Text',
      description: 'Helper text below the field',
    },
    description: {
      displayName: 'Description',
      description: 'Descriptive text',
    },
    showPasswordToggle: {
      displayName: 'Show Password Toggle',
      description: 'Show button to toggle password visibility',
    },
    isClearable: {
      displayName: 'Clearable',
      description: 'Show button to clear the field',
    },
    isInvalid: {
      displayName: 'Invalid',
      description: 'Mark the field as invalid',
    },
    fullWidth: {
      displayName: 'Full Width',
      description: 'Take full available width',
    },
    disabled: {
      displayName: 'Disabled',
      description: 'Disable the field',
    },
    required: {
      displayName: 'Required',
      description: 'Mark the field as required',
    },
  },
};
