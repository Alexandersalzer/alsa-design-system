/**
 * English translations for Textarea component
 */

export const textareaTranslations_en = {
  displayName: 'Textarea',
  description: 'Multi-line text field for longer content',
  
  props: {
    label: {
      displayName: 'Label',
      description: 'Label text for the field',
    },
    placeholder: {
      displayName: 'Placeholder',
      description: 'Placeholder text when field is empty',
    },
    description: {
      displayName: 'Description',
      description: 'Helper text below the label',
    },
    error: {
      displayName: 'Error Message',
      description: 'Error message to display',
    },
    success: {
      displayName: 'Success Message',
      description: 'Success message to display',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visual style variant',
      valueLabels: {
        flat: 'Flat',
        bordered: 'Bordered',
        faded: 'Faded',
        underlined: 'Underlined',
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
    resize: {
      displayName: 'Resize',
      description: 'How user can resize',
      valueLabels: {
        none: 'None',
        vertical: 'Vertical',
        horizontal: 'Horizontal',
        both: 'Both',
      },
    },
    showCharacterCount: {
      displayName: 'Show Character Count',
      description: 'Display character count',
    },
    autoResize: {
      displayName: 'Auto Resize',
      description: 'Adjust height based on content',
    },
    isClearable: {
      displayName: 'Clearable',
      description: 'Show button to clear the field',
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
