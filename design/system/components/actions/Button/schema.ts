/**
 * Button Component Schema
 * 
 * Defines the complete schema for the Button component including:
 * - All available props with types and validation
 * - Default values
 * - CMS editor configuration
 * - Usage examples
 */

import { ComponentSchema } from '../../../core/schemas/component.types';

export const buttonSchema: ComponentSchema = {
  $id: 'button',
  displayName: 'Button',
  category: 'actions',
  description: 'Interactive button component with multiple variants, sizes, and action support',
  icon: 'MousePointerClick',
  tags: ['action', 'cta', 'interactive', 'clickable'],
  version: '1.0.0',
  cmsEnabled: true,
  
  defaultProps: {
    variant: 'primary',
    size: 'md',
    radius: 'md',
    content: 'Click here',
    fullWidth: false,
    loading: false,
  },
  
  props: {
    content: {
      name: 'content',
      type: 'string',
      displayName: 'Button Text',
      description: 'Text content displayed on the button',
      required: true,
      default: 'Click here',
      editorType: 'text',
      placeholder: 'Enter button text...',
      maxLength: 50,
      group: 'content',
      examples: ['Learn More', 'Get Started', 'Contact Us', 'Book a Call'],
    },
    
    variant: {
      name: 'variant',
      type: 'enum',
      displayName: 'Variant',
      description: 'Visual style variant of the button',
      required: false,
      default: 'primary',
      editorType: 'segmented',
      values: ['brand', 'primary', 'secondary', 'accent', 'ghost', 'destructive'] as const,
      valueLabels: {
        brand: 'Brand',
        primary: 'Primary',
        secondary: 'Secondary',
        accent: 'Accent',
        ghost: 'Ghost',
        destructive: 'Destructive',
      },
      valuePreviews: {
        brand: { type: 'color', value: 'var(--color-brand)' },
        primary: { type: 'color', value: 'var(--color-primary)' },
        secondary: { type: 'color', value: 'var(--color-secondary)' },
        accent: { type: 'color', value: 'var(--color-accent)' },
        ghost: { type: 'color', value: 'transparent' },
        destructive: { type: 'color', value: 'var(--color-error)' },
      },
      group: 'appearance',
    },
    
    size: {
      name: 'size',
      type: 'enum',
      displayName: 'Size',
      description: 'Button size',
      required: false,
      default: 'md',
      editorType: 'segmented',
      values: ['sm', 'md', 'lg', 'xl'] as const,
      valueLabels: {
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
      },
      group: 'appearance',
    },
    
    radius: {
      name: 'radius',
      type: 'enum',
      displayName: 'Border Radius',
      description: 'Corner rounding of the button',
      required: false,
      default: 'md',
      editorType: 'select',
      values: ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'full'] as const,
      valueLabels: {
        none: 'None',
        xs: 'Extra Small',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
        full: 'Full (Pill)',
      },
      group: 'appearance',
    },
    
    fullWidth: {
      name: 'fullWidth',
      type: 'boolean',
      displayName: 'Full Width',
      description: 'Make button take full width of container',
      required: false,
      default: false,
      editorType: 'toggle',
      trueLabel: 'Full Width',
      falseLabel: 'Auto Width',
      group: 'layout',
    },
    
    loading: {
      name: 'loading',
      type: 'boolean',
      displayName: 'Loading State',
      description: 'Show loading spinner',
      required: false,
      default: false,
      editorType: 'toggle',
      editorHint: 'Usually controlled programmatically',
      group: 'state',
    },
    
    disabled: {
      name: 'disabled',
      type: 'boolean',
      displayName: 'Disabled',
      description: 'Disable button interaction',
      required: false,
      default: false,
      editorType: 'toggle',
      group: 'state',
    },
    
    href: {
      name: 'href',
      type: 'string',
      displayName: 'Link URL',
      description: 'URL to navigate to (renders as link instead of button)',
      required: false,
      editorType: 'url',
      placeholder: 'https://example.com or /about',
      group: 'navigation',
      editorHint: 'Leave empty to use action config instead',
    },
    
    target: {
      name: 'target',
      type: 'enum',
      displayName: 'Link Target',
      description: 'How to open the link',
      required: false,
      editorType: 'select',
      values: ['_self', '_blank'] as const,
      valueLabels: {
        _self: 'Same Tab',
        _blank: 'New Tab',
      },
      group: 'navigation',
      visibleWhen: {
        property: 'href',
        operator: 'exists',
      },
    },
    
    action: {
      name: 'action',
      type: 'object',
      displayName: 'Action Configuration',
      description: 'Define what happens when button is clicked',
      required: false,
      editorType: 'builder',
      editorHint: 'Configure navigation, booking, form submission, etc.',
      properties: {
        type: {
          name: 'type',
          type: 'enum',
          displayName: 'Action Type',
          required: true,
          values: ['navigation', 'booking', 'contact', 'newsletter'] as const,
          valueLabels: {
            navigation: 'Navigate to Page',
            booking: 'Open Booking Modal',
            contact: 'Submit Contact Form',
            newsletter: 'Newsletter Signup',
          },
        },
        settings: {
          name: 'settings',
          type: 'object',
          displayName: 'Action Settings',
          required: true,
          editorType: 'group',
          additionalProperties: true,
        },
      },
      group: 'behavior',
    },
  },
  
  validation: [
    {
      id: 'content-not-empty',
      message: 'Button text cannot be empty',
      validator: (value, allProps) => {
        const content = allProps.content || '';
        return content.trim().length > 0;
      },
      severity: 'error',
    },
    {
      id: 'content-length',
      message: 'Button text should be concise (max 50 characters recommended)',
      validator: (value, allProps) => {
        const content = allProps.content || '';
        return content.length <= 50;
      },
      severity: 'warning',
    },
    {
      id: 'href-or-action',
      message: 'Consider using either href or action, not both',
      validator: (value, allProps) => {
        const hasHref = !!allProps.href;
        const hasAction = !!allProps.action;
        return !(hasHref && hasAction);
      },
      severity: 'warning',
    },
  ],
  
  examples: [
    {
      name: 'Primary CTA',
      description: 'Standard call-to-action button',
      category: 'common',
      data: {
        type: 'button',
        props: {
          content: 'Get Started',
          variant: 'primary',
          size: 'lg',
        },
      },
    },
    {
      name: 'Navigation Button',
      description: 'Button that navigates to another page',
      category: 'navigation',
      data: {
        type: 'button',
        props: {
          content: 'Learn More',
          variant: 'secondary',
          action: {
            type: 'navigation',
            settings: {
              pageId: 'about',
            },
          },
        },
      },
    },
    {
      name: 'Booking Button',
      description: 'Opens booking modal (Calendly/Cal.com)',
      category: 'booking',
      data: {
        type: 'button',
        props: {
          content: 'Book a Call',
          variant: 'accent',
          size: 'lg',
          action: {
            type: 'booking',
            settings: {
              calendlyUrl: 'username/30min',
            },
          },
        },
      },
    },
    {
      name: 'Ghost Button',
      description: 'Subtle secondary action',
      category: 'common',
      data: {
        type: 'button',
        props: {
          content: 'Cancel',
          variant: 'ghost',
          size: 'md',
        },
      },
    },
  ],
  
  related: ['link', 'iconButton'],
  docsUrl: '/docs/components/button',
};

export default buttonSchema;
