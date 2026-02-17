/**
 * IconButton Component Schema
 * 
 * Defines the complete schema for the IconButton component including:
 * - All available props with types and validation
 * - Default values (language-specific)
 * - CMS editor configuration
 * - Usage examples
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { iconButtonTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

/**
 * Create a localized IconButton schema
 * @param locale - Locale code (e.g., 'sv', 'en')
 * @returns ComponentSchema with localized strings
 */
export const createIconButtonSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(iconButtonTranslations, locale);
  
  return {
    $id: 'iconButton',
    displayName: t.displayName,
    category: 'actions',
    description: t.description,
    icon: 'CursorArrowRipple',
    tags: ['action', 'icon', 'button', 'interactive', 'toolbar'],
    version: '1.0.0',
    cmsEnabled: false, // Icon buttons typically not editable in CMS (icon selection complex)
    
    defaultProps: {
      variant: 'secondary',
      size: 'lg',
      loading: false,
      disabled: false,
      tooltip: false,
    },
    
    props: {
      icon: createLocalizedProp(
        {
          name: 'icon',
          type: 'object', // Icon is a React element
          required: true,
          editorType: 'builder', // Would need custom icon picker
          group: 'content',
          cmsEnabled: false, // Too complex for CMS
        },
        t.props?.icon
      ),
      
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'secondary',
          editorType: 'segmented',
          values: ['primary', 'secondary', 'accent', 'ghost', 'destructive'] as const,
          valuePreviews: {
            primary: { type: 'color', value: 'var(--color-primary)' },
            secondary: { type: 'color', value: 'var(--color-secondary)' },
            accent: { type: 'color', value: 'var(--color-accent)' },
            ghost: { type: 'color', value: 'transparent' },
            destructive: { type: 'color', value: 'var(--color-error)' },
          },
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
          default: 'lg',
          editorType: 'segmented',
          values: ['sm', 'md', 'lg', 'xl'] as const,
          group: 'appearance',
          cmsEnabled: false,
        },
        t.props?.size
      ),
      
      badge: createLocalizedProp(
        {
          name: 'badge',
          type: 'string', // Can be number or string
          required: false,
          editorType: 'text',
          maxLength: 10,
          group: 'content',
          cmsEnabled: false,
        },
        t.props?.badge
      ),
      
      'aria-label': createLocalizedProp(
        {
          name: 'aria-label',
          type: 'string',
          required: true,
          editorType: 'text',
          maxLength: 100,
          group: 'accessibility',
          cmsEnabled: false,
        },
        t.props?.ariaLabel
      ),
      
      tooltip: createLocalizedProp(
        {
          name: 'tooltip',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
          cmsEnabled: false,
        },
        t.props?.tooltip
      ),
      
      tooltipContent: createLocalizedProp(
        {
          name: 'tooltipContent',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 200,
          group: 'behavior',
          visibleWhen: {
            property: 'tooltip',
            operator: 'equals',
            value: true,
          },
          cmsEnabled: false,
        },
        t.props?.tooltipContent
      ),
      
      loading: createLocalizedProp(
        {
          name: 'loading',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
          cmsEnabled: false,
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
          cmsEnabled: false,
        },
        t.props?.disabled
      ),
    },
    
    validation: [
      {
        id: 'icon-required',
        message: t.validation?.['icon-required'] || 'Icon is required',
        validator: (value, allProps) => {
          return !!allProps.icon;
        },
        severity: 'error',
      },
      {
        id: 'aria-label-required',
        message: t.validation?.['aria-label-required'] || 'aria-label is required for accessibility',
        validator: (value, allProps) => {
          const label = allProps['aria-label'] || '';
          return label.trim().length > 0;
        },
        severity: 'error',
      },
    ],
    
    examples: [
      {
        name: t.examples?.['edit-button']?.name || 'Edit Button',
        description: t.examples?.['edit-button']?.description || 'Button for editing content',
        category: t.examples?.['edit-button']?.category || 'common',
        data: {
          type: 'iconButton',
          props: {
            icon: 'PencilIcon',
            variant: 'secondary',
            size: 'md',
            'aria-label': 'Edit',
          },
        },
      },
      {
        name: t.examples?.['delete-button']?.name || 'Delete Button',
        description: t.examples?.['delete-button']?.description || 'Destructive button for deletion',
        category: t.examples?.['delete-button']?.category || 'common',
        data: {
          type: 'iconButton',
          props: {
            icon: 'TrashIcon',
            variant: 'destructive',
            size: 'md',
            'aria-label': 'Delete',
          },
        },
      },
      {
        name: t.examples?.['with-badge']?.name || 'With Badge',
        description: t.examples?.['with-badge']?.description || 'Button with notification badge',
        category: t.examples?.['with-badge']?.category || 'notifications',
        data: {
          type: 'iconButton',
          props: {
            icon: 'BellIcon',
            variant: 'ghost',
            size: 'lg',
            badge: '5',
            'aria-label': 'Notifications',
          },
        },
      },
      {
        name: t.examples?.['with-tooltip']?.name || 'With Tooltip',
        description: t.examples?.['with-tooltip']?.description || 'Button with tooltip on hover',
        category: t.examples?.['with-tooltip']?.category || 'common',
        data: {
          type: 'iconButton',
          props: {
            icon: 'QuestionMarkCircleIcon',
            variant: 'ghost',
            size: 'md',
            tooltip: true,
            tooltipContent: 'Get help',
            'aria-label': 'Help',
          },
        },
      },
    ],
    
    related: ['button', 'textLink'],
    docsUrl: '/docs/components/icon-button',
  };
};

// Default export with Swedish locale
export const iconButtonSchema = createIconButtonSchema('sv');

export default iconButtonSchema;
