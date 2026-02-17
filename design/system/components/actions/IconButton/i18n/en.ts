/**
 * English translations for IconButton component
 */

export const iconButtonTranslations_en = {
  displayName: 'Icon Button',
  description: 'A button displaying only an icon, commonly used for toolbar actions and compact interfaces',
  
  props: {
    icon: {
      displayName: 'Icon',
      description: 'The icon to display in the button',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visual style of the button',
      valueLabels: {
        primary: 'Primary',
        secondary: 'Secondary',
        accent: 'Accent',
        ghost: 'Ghost',
        destructive: 'Destructive',
      },
    },
    size: {
      displayName: 'Size',
      description: 'Size of the button',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
      },
    },
    badge: {
      displayName: 'Badge',
      description: 'Display a badge with number or text (e.g. notifications)',
    },
    ariaLabel: {
      displayName: 'Accessibility Label',
      description: 'Descriptive text for screen readers (required)',
    },
    tooltip: {
      displayName: 'Show Tooltip',
      description: 'Enable tooltip on hover',
    },
    tooltipContent: {
      displayName: 'Tooltip Content',
      description: 'Custom content for tooltip (uses aria-label if not specified)',
    },
    loading: {
      displayName: 'Loading',
      description: 'Show loading indicator',
    },
    disabled: {
      displayName: 'Disabled',
      description: 'Make the button inactive',
    },
  },
  
  validation: {
    'icon-required': 'An icon must be provided',
    'aria-label-required': 'Accessibility label (aria-label) is required',
  },
  
  examples: {
    'edit-button': {
      name: 'Edit Button',
      description: 'Button for editing content',
      category: 'common',
    },
    'delete-button': {
      name: 'Delete Button',
      description: 'Destructive button for deletion',
      category: 'common',
    },
    'with-badge': {
      name: 'With Badge',
      description: 'Button with notification badge',
      category: 'notifications',
    },
    'with-tooltip': {
      name: 'With Tooltip',
      description: 'Button with tooltip on hover',
      category: 'common',
    },
  },
};
