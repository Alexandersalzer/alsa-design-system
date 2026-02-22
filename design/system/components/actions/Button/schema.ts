/**
 * Button Component Schema
 * 
 * Defines the complete schema for the Button component including:
 * - All available props with types and validation
 * - Default values (language-specific)
 * - CMS editor configuration
 * - Usage examples
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { createActionPropConfig } from '../../../core/actions/schema';
import { buttonTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

/**
 * Create a localized Button schema
 * @param locale - Locale code (e.g., 'sv', 'en')
 * @returns ComponentSchema with localized strings
 */
export const createButtonSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(buttonTranslations, locale);
  
  return {
    $id: 'button',
    displayName: t.displayName,
    category: 'actions',
    description: t.description,
    icon: 'MousePointerClick',
    tags: ['action', 'cta', 'interactive', 'clickable'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      variant: 'primary',
      size: 'md',
      radius: 'md',
      content: t.defaultContent, // ← Language-specific default
      fullWidth: false,
      loading: false,
    },
    
    props: {
      content: createLocalizedProp(
        {
          name: 'content',
          type: 'string',
          required: true,
          default: t.defaultContent,
          editorType: 'text',
          maxLength: 50,
          group: 'content',
          cmsEnabled: true,
        },
        t.props?.content
      ),
      
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'primary',
          editorType: 'segmented',
          values: ['brand', 'primary', 'secondary', 'accent', 'ghost', 'destructive'] as const,
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
        t.props?.variant
      ),
      
      size: createLocalizedProp(
        {
          name: 'size',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['sm', 'md', 'lg', 'xl'] as const,
          group: 'appearance',
        },
        t.props?.size
      ),
      
      radius: createLocalizedProp(
        {
          name: 'radius',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'select',
          values: ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'full'] as const,
          group: 'appearance',
        },
        t.props?.radius
      ),
      
      fullWidth: createLocalizedProp(
        {
          name: 'fullWidth',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'layout',
        },
        t.props?.fullWidth
      ),
      
      loading: createLocalizedProp(
        {
          name: 'loading',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
        },
        t.props?.loading
      ),
      
      disabled: createLocalizedProp(
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
        },
        t.props?.disabled
      ),
      
      href: createLocalizedProp(
        {
          name: 'href',
          type: 'string',
          required: false,
          editorType: 'url',
          group: 'navigation',
        },
        t.props?.href
      ),
      
      target: createLocalizedProp(
        {
          name: 'target',
          type: 'enum',
          required: false,
          editorType: 'select',
          values: ['_self', '_blank'] as const,
          group: 'navigation',
          visibleWhen: {
            property: 'href',
            operator: 'exists',
          },
        },
        t.props?.target
      ),
      
      // Use shared action configuration
      action: createLocalizedProp(
        createActionPropConfig(),
        t.props?.action
      ),
    },
    
    validation: [
      {
        id: 'content-not-empty',
        message: t.validation?.['content-not-empty'] || 'Button text cannot be empty',
        validator: (value, allProps) => {
          const content = allProps.content || '';
          return content.trim().length > 0;
        },
        severity: 'error',
      },
      {
        id: 'content-length',
        message: t.validation?.['content-length'] || 'Button text should be concise (max 50 characters recommended)',
        validator: (value, allProps) => {
          const content = allProps.content || '';
          return content.length <= 50;
        },
        severity: 'warning',
      },
      {
        id: 'href-or-action',
        message: t.validation?.['href-or-action'] || 'Consider using either href or action, not both',
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
        name: t.examples?.['primary-cta']?.name || 'Primary CTA',
        description: t.examples?.['primary-cta']?.description || 'Standard call-to-action button',
        category: t.examples?.['primary-cta']?.category || 'common',
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
        name: t.examples?.['navigation']?.name || 'Navigation Button',
        description: t.examples?.['navigation']?.description || 'Button that navigates to another page',
        category: t.examples?.['navigation']?.category || 'navigation',
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
        name: t.examples?.['booking']?.name || 'Booking Button',
        description: t.examples?.['booking']?.description || 'Opens booking modal (Calendly/Cal.com)',
        category: t.examples?.['booking']?.category || 'booking',
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
        name: t.examples?.['ghost']?.name || 'Ghost Button',
        description: t.examples?.['ghost']?.description || 'Subtle secondary action',
        category: t.examples?.['ghost']?.category || 'common',
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
};

// Default export with Swedish locale (most common for Blimpify)
export const buttonSchema = createButtonSchema('sv');

export default buttonSchema;
