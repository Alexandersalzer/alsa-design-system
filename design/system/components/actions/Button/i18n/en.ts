/**
 * English translations for Button component
 */

import type { ComponentTranslation } from '../../../../core/schemas/i18n/types';

export const en: ComponentTranslation = {
  displayName: 'Button',
  description: 'Interactive button component with multiple variants, sizes, and action support',
  defaultContent: 'Click here',
  
  props: {
    content: {
      displayName: 'Button Text',
      description: 'Text content displayed on the button',
      placeholder: 'Enter button text...',
      examples: ['Learn More', 'Get Started', 'Contact Us', 'Book a Call'],
    },
    
    variant: {
      displayName: 'Variant',
      description: 'Visual style variant of the button',
      valueLabels: {
        brand: 'Brand',
        primary: 'Primary',
        secondary: 'Secondary',
        accent: 'Accent',
        ghost: 'Ghost',
        destructive: 'Destructive',
      },
    },
    
    size: {
      displayName: 'Size',
      description: 'Button size',
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
      },
    },
    
    radius: {
      displayName: 'Border Radius',
      description: 'Corner rounding of the button',
      valueLabels: {
        none: 'None',
        xs: 'Extra Small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
        full: 'Full (Pill)',
      },
    },
    
    fullWidth: {
      displayName: 'Full Width',
      description: 'Make button take full width of container',
      trueLabel: 'Full Width',
      falseLabel: 'Auto Width',
    },
    
    loading: {
      displayName: 'Loading State',
      description: 'Show loading spinner',
      editorHint: 'Usually controlled programmatically',
    },
    
    disabled: {
      displayName: 'Disabled',
      description: 'Disable button interaction',
    },
    
    href: {
      displayName: 'Link URL',
      description: 'URL to navigate to (renders as link instead of button)',
      placeholder: 'https://example.com or /about',
      editorHint: 'Leave empty to use action config instead',
    },
    
    target: {
      displayName: 'Link Target',
      description: 'How to open the link',
      valueLabels: {
        _self: 'Same Tab',
        _blank: 'New Tab',
      },
    },
    
    action: {
      displayName: 'Action Configuration',
      description: 'Define what happens when button is clicked',
      editorHint: 'Configure navigation, booking, form submission, etc.',
    },
  },
  
  validation: {
    'content-not-empty': 'Button text cannot be empty',
    'content-length': 'Button text should be concise (max 50 characters recommended)',
    'href-or-action': 'Consider using either href or action, not both',
  },
  
  examples: {
    'primary-cta': {
      name: 'Primary CTA',
      description: 'Standard call-to-action button',
      category: 'common',
    },
    'navigation': {
      name: 'Navigation Button',
      description: 'Button that navigates to another page',
      category: 'navigation',
    },
    'booking': {
      name: 'Booking Button',
      description: 'Opens booking modal (Calendly/Cal.com)',
      category: 'booking',
    },
    'ghost': {
      name: 'Ghost Button',
      description: 'Subtle secondary action',
      category: 'common',
    },
  },
};
