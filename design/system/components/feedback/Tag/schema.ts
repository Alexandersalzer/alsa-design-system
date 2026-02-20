/**
 * Tag Component Schema
 * 
 * Label for categories, status or filters
 * Content component - CMS editable
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { tagTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createTagSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(tagTranslations, locale);
  
  return {
    $id: 'tag',
    displayName: t.displayName,
    category: 'feedback',
    description: t.description,
    icon: 'Tag',
    tags: ['tag', 'label', 'category', 'status', 'filter'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      variant: 'default',
      size: 'medium',
      surface: 'subtle',
    },
    
    props: {
      children: createLocalizedProp(
        {
          name: 'children',
          type: 'string',
          required: true,
          editorType: 'text',
          maxLength: 50,
          placeholder: 'Tag text...',
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.children
      ),
      
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'default',
          editorType: 'select',
          values: ['success', 'error', 'warning', 'info', 'accent', 'default'] as const,
          cmsEnabled: true,
          group: 'appearance',
        },
        t.props?.variant
      ),
      
      size: createLocalizedProp(
        {
          name: 'size',
          type: 'enum',
          required: false,
          default: 'medium',
          editorType: 'segmented',
          values: ['small', 'medium', 'large'] as const,
          cmsEnabled: true,
          group: 'appearance',
        },
        t.props?.size
      ),
      
      surface: createLocalizedProp(
        {
          name: 'surface',
          type: 'enum',
          required: false,
          default: 'subtle',
          editorType: 'segmented',
          values: ['subtle', 'muted', 'vibrant'] as const,
          cmsEnabled: true,
          group: 'appearance',
        },
        t.props?.surface
      ),
    },
    
    validation: [
      {
        id: 'tag-children-required',
        message: 'Tag text is required',
        validator: (value: any) => !!value.children,
      },
    ],
    examples: [],
    
    related: ['badge', 'chip'],
    docsUrl: '/docs/components/tag',
  };
};

export const tagSchema = createTagSchema('sv');
export default tagSchema;
