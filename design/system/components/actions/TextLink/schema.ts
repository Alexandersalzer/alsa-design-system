/**
 * TextLink Component Schema
 * 
 * Defines the complete schema for the TextLink component including:
 * - All available props with types and validation
 * - Default values (language-specific)
 * - CMS editor configuration
 * - Usage examples
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { textLinkTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

/**
 * Create a localized TextLink schema
 * @param locale - Locale code (e.g., 'sv', 'en')
 * @returns ComponentSchema with localized strings
 */
export const createTextLinkSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(textLinkTranslations, locale);
  
  return {
    $id: 'textLink',
    displayName: t.displayName,
    category: 'actions',
    description: t.description,
    icon: 'Link',
    tags: ['link', 'navigation', 'anchor', 'hyperlink'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      variant: 'primary',
      size: 'md',
      weight: 'medium',
      underline: 'none',
      disabled: false,
    },
    
    props: {
      content: createLocalizedProp(
        {
          name: 'content',
          type: 'string',
          required: true,
          editorType: 'text',
          maxLength: 100,
          group: 'content',
          cmsEnabled: true,
        },
        t.props?.content
      ),
      
      href: createLocalizedProp(
        {
          name: 'href',
          type: 'string',
          required: false,
          editorType: 'url',
          group: 'navigation',
          cmsEnabled: true,
        },
        t.props?.href
      ),
      
      action: createLocalizedProp(
        {
          name: 'action',
          type: 'object',
          required: false,
          editorType: 'builder',
          properties: {
            type: {
              name: 'type',
              type: 'enum',
              displayName: 'Action Type',
              required: true,
              values: ['navigation'] as const,
              valueLabels: {
                navigation: 'Navigate to Page',
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
          cmsEnabled: true,
        },
        t.props?.action
      ),
      
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'primary',
          editorType: 'select',
          values: ['primary', 'secondary', 'accent', 'ghost', 'button-ghost', 'brand', 'inverse'] as const,
          group: 'appearance',
          cmsEnabled: false,
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
          cmsEnabled: false,
        },
        t.props?.size
      ),
      
      weight: createLocalizedProp(
        {
          name: 'weight',
          type: 'enum',
          required: false,
          default: 'medium',
          editorType: 'select',
          values: ['regular', 'medium', 'semibold', 'bold'] as const,
          group: 'appearance',
          cmsEnabled: false,
        },
        t.props?.weight
      ),
      
      underline: createLocalizedProp(
        {
          name: 'underline',
          type: 'enum',
          required: false,
          default: 'none',
          editorType: 'segmented',
          values: ['none', 'hover', 'always'] as const,
          group: 'appearance',
          cmsEnabled: false,
        },
        t.props?.underline
      ),
      
      disabled: createLocalizedProp(
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
          cmsEnabled: false,
        },
        t.props?.disabled
      ),
    },
    
    validation: [
      {
        id: 'content-not-empty',
        message: t.validation?.['content-not-empty'] || 'Link text cannot be empty',
        validator: (value, allProps) => {
          const content = allProps.content || '';
          return content.trim().length > 0;
        },
        severity: 'error',
      },
      {
        id: 'href-or-action',
        message: t.validation?.['href-or-action'] || 'Either href or action must be specified',
        validator: (value, allProps) => {
          return !!allProps.href || !!allProps.action;
        },
        severity: 'warning',
      },
    ],
    
    examples: [
      {
        name: t.examples?.['simple-link']?.name || 'Simple Link',
        description: t.examples?.['simple-link']?.description || 'Basic text link',
        category: t.examples?.['simple-link']?.category || 'common',
        data: {
          type: 'textLink',
          props: {
            content: 'Learn More',
            href: '/about',
            variant: 'primary',
          },
        },
      },
      {
        name: t.examples?.['underlined']?.name || 'Underlined',
        description: t.examples?.['underlined']?.description || 'Link with underline',
        category: t.examples?.['underlined']?.category || 'common',
        data: {
          type: 'textLink',
          props: {
            content: 'Read Documentation',
            href: '/docs',
            underline: 'always',
          },
        },
      },
    ],
    
    related: ['button', 'iconButton'],
    docsUrl: '/docs/components/text-link',
  };
};

// Default export with Swedish locale
export const textLinkSchema = createTextLinkSchema('sv');

export default textLinkSchema;
