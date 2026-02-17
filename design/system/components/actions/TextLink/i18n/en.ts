/**
 * English translations for TextLink component
 */

export const textLinkTranslations_en = {
  displayName: 'Text Link',
  description: 'A semantic link with various styles and icons for navigation',
  
  props: {
    content: {
      displayName: 'Text',
      description: 'The text displayed in the link',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visual style of the link',
      valueLabels: {
        primary: 'Primary',
        secondary: 'Secondary',
        accent: 'Accent',
        ghost: 'Ghost',
        'button-ghost': 'Button Ghost',
        brand: 'Brand',
        inverse: 'Inverse',
      },
    },
    size: {
      displayName: 'Size',
      description: 'Size of the link text',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
      },
    },
    weight: {
      displayName: 'Text Weight',
      description: 'Thickness of the text',
      valueLabels: {
        regular: 'Regular',
        medium: 'Medium',
        semibold: 'Semibold',
        bold: 'Bold',
      },
    },
    underline: {
      displayName: 'Underline',
      description: 'When the link should be underlined',
      valueLabels: {
        none: 'Never',
        hover: 'On Hover',
        always: 'Always',
      },
    },
    href: {
      displayName: 'URL',
      description: 'The link destination (URL)',
    },
    action: {
      displayName: 'Action',
      description: 'Navigation action when link is clicked',
    },
    disabled: {
      displayName: 'Disabled',
      description: 'Make the link inactive',
    },
  },
  
  validation: {
    'content-not-empty': 'Link text cannot be empty',
    'href-or-action': 'Either href or action must be specified',
  },
  
  examples: {
    'simple-link': {
      name: 'Simple Link',
      description: 'Basic text link',
      category: 'common',
    },
    'with-icon': {
      name: 'With Icon',
      description: 'Link with icon',
      category: 'common',
    },
    'underlined': {
      name: 'Underlined',
      description: 'Link with underline',
      category: 'common',
    },
  },
};
