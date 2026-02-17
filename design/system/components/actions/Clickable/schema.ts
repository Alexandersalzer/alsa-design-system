/**
 * Clickable Component Schema
 * 
 * Generic interactive container - typically used internally
 * Not commonly exposed to CMS as it's a building block
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { clickableTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createClickableSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(clickableTranslations, locale);
  
  return {
    $id: 'clickable',
    displayName: t.displayName,
    category: 'actions',
    description: t.description,
    icon: 'CursorArrowRays',
    tags: ['container', 'interactive', 'wrapper', 'utility'],
    version: '1.0.0',
    cmsEnabled: false, // Internal building block, not for CMS
    
    defaultProps: {
      as: 'div',
      variant: 'default',
      padding: 'md',
      borderRadius: 'md',
      background: 'transparent',
      border: 'none',
      interactive: true,
      disabled: false,
      loading: false,
    },
    
    props: {
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'default',
          editorType: 'segmented',
          values: ['default', 'bordered'] as const,
          group: 'appearance',
        },
        t.props?.variant
      ),
      
      background: createLocalizedProp(
        {
          name: 'background',
          type: 'enum',
          required: false,
          default: 'transparent',
          editorType: 'select',
          values: ['transparent', 'subdued', 'card', 'hover', 'selected'] as const,
          group: 'appearance',
        },
        t.props?.background
      ),
      
      border: createLocalizedProp(
        {
          name: 'border',
          type: 'enum',
          required: false,
          default: 'none',
          editorType: 'select',
          values: ['none', 'base', 'strong', 'subtle'] as const,
          group: 'appearance',
        },
        t.props?.border
      ),
      
      padding: createLocalizedProp(
        {
          name: 'padding',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'select',
          values: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const,
          group: 'layout',
        },
        t.props?.padding
      ),
      
      borderRadius: createLocalizedProp(
        {
          name: 'borderRadius',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'select',
          values: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full'] as const,
          group: 'appearance',
        },
        t.props?.borderRadius
      ),
      
      interactive: createLocalizedProp(
        {
          name: 'interactive',
          type: 'boolean',
          required: false,
          default: true,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.interactive
      ),
      
      selected: createLocalizedProp(
        {
          name: 'selected',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
        },
        t.props?.selected
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
    },
    
    validation: [],
    examples: [],
    
    related: ['button', 'selectionCard'],
    docsUrl: '/docs/components/clickable',
  };
};

export const clickableSchema = createClickableSchema('sv');
export default clickableSchema;
