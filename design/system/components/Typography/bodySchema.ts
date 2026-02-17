/**
 * Body Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { bodyTranslations } from './i18n-body';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createBodySchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(bodyTranslations, locale);
  
  return {
    $id: 'body',
    displayName: t.displayName,
    category: 'typography',
    description: t.description,
    icon: 'Bars3BottomLeft',
    tags: ['typography', 'body', 'paragraph', 'text'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      size: 'md',
      color: 'body',
      weight: 'regular',
    },
    
    props: {
      children: createLocalizedProp(
        {
          name: 'children',
          type: 'string',
          required: true,
          editorType: 'textarea',
          group: 'content',
        },
        t.props?.children
      ),
      
      size: createLocalizedProp(
        {
          name: 'size',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['xl', 'lg', 'md', 'sm', 'xs'] as const,
          group: 'appearance',
        },
        t.props?.size
      ),
      
      weight: createLocalizedProp(
        {
          name: 'weight',
          type: 'enum',
          required: false,
          default: 'regular',
          editorType: 'select',
          values: ['light', 'regular', 'medium', 'semibold', 'bold'] as const,
          group: 'appearance',
        },
        t.props?.weight
      ),
      
      align: createLocalizedProp(
        {
          name: 'align',
          type: 'enum',
          required: false,
          editorType: 'segmented',
          values: ['left', 'center', 'right', 'justify'] as const,
          group: 'appearance',
        },
        t.props?.align
      ),
    },
    
    validation: [
      {
        id: 'body-content-required',
        message: 'Body text content is required',
        validator: (value: any) => !!value.children && value.children.length > 0,
      },
    ],
    examples: [],
    
    related: ['heading', 'label'],
    docsUrl: '/docs/components/body',
  };
};

export const bodySchema = createBodySchema('sv');
export default bodySchema;
