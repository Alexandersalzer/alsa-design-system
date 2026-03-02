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
      content: t.defaultContent,
      variant: 'default',
      size: 'medium',
      surface: 'subtle',
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
          placeholder: 'Tag text...',
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
          cmsEnabled: false,
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
          cmsEnabled: false,
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
          cmsEnabled: false,
          group: 'appearance',
        },
        t.props?.surface
      ),
    },
    
    validation: [
      {
        id: 'tag-content-required',
        message: 'Tag text is required',
        validator: (value: any) => !!value.content,
      },
    ],
    examples: [],
    
    related: ['badge', 'chip'],
    docsUrl: '/docs/components/tag',
  };
};

export const tagSchema = createTagSchema('sv');
export default tagSchema;
