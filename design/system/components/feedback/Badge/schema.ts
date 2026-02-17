/**
 * Badge Component Schema
 * 
 * Notification and status indicator
 * Feedback component
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { badgeTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createBadgeSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(badgeTranslations, locale);
  
  return {
    $id: 'badge',
    displayName: t.displayName,
    category: 'feedback',
    description: t.description,
    icon: 'Bell',
    tags: ['badge', 'notification', 'indicator', 'status'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      variant: 'default',
      size: 'md',
      placement: 'top-right',
      isDot: false,
    },
    
    props: {
      content: createLocalizedProp(
        {
          name: 'content',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 10,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.content
      ),
      
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'default',
          editorType: 'select',
          values: ['success', 'error', 'warning', 'info', 'accent', 'default'] as const,
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
          values: ['sm', 'md', 'lg'] as const,
          group: 'appearance',
        },
        t.props?.size
      ),
      
      placement: createLocalizedProp(
        {
          name: 'placement',
          type: 'enum',
          required: false,
          default: 'top-right',
          editorType: 'select',
          values: ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const,
          group: 'layout',
        },
        t.props?.placement
      ),
      
      isDot: createLocalizedProp(
        {
          name: 'isDot',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'appearance',
        },
        t.props?.isDot
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['tag', 'alert'],
    docsUrl: '/docs/components/badge',
  };
};

export const badgeSchema = createBadgeSchema('sv');
export default badgeSchema;
