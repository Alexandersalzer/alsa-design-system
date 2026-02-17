/**
 * Card Component Schema
 * 
 * Container for grouping content
 * Layout component
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { cardTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createCardSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(cardTranslations, locale);
  
  return {
    $id: 'card',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'Square3Stack3D',
    tags: ['card', 'container', 'layout', 'group'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      variant: 'default',
      padding: 'md',
      radius: 'md',
      interactive: false,
    },
    
    props: {
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'default',
          editorType: 'select',
          values: ['default', 'raised', 'elevated', 'outlined', 'solid', 'ghost', 'bordered', 'accent-subtle', 'accent-muted'] as const,
          group: 'appearance',
        },
        t.props?.variant
      ),
      
      padding: createLocalizedProp(
        {
          name: 'padding',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['none', 'xs', 'sm', 'md', 'lg'] as const,
          group: 'layout',
        },
        t.props?.padding
      ),
      
      radius: createLocalizedProp(
        {
          name: 'radius',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['sm', 'md', 'lg'] as const,
          group: 'appearance',
        },
        t.props?.radius
      ),
      
      interactive: createLocalizedProp(
        {
          name: 'interactive',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.interactive
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['hStack', 'vStack', 'grid'],
    docsUrl: '/docs/components/card',
  };
};

export const cardSchema = createCardSchema('sv');
export default cardSchema;
