/**
 * Display Component Schema
 */

import { ComponentSchema } from '../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../core/schemas/i18n';
import { displayTranslations } from './i18n-display';
import type { SupportedLocale } from '../../core/schemas/i18n/types';

export const createDisplaySchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(displayTranslations, locale);
  
  return {
    $id: 'display',
    displayName: t.displayName,
    category: 'typography',
    description: t.description,
    icon: 'DocumentText',
    tags: ['typography', 'display', 'heading', 'hero'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      size: 'lg',
      color: 'heading',
      weight: 'bold',
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
          default: 'lg',
          editorType: 'segmented',
          values: ['xl', 'lg', 'md', 'sm'] as const,
          group: 'appearance',
        },
        t.props?.size
      ),
      
      weight: createLocalizedProp(
        {
          name: 'weight',
          type: 'enum',
          required: false,
          default: 'bold',
          editorType: 'select',
          values: ['light', 'regular', 'medium', 'semibold', 'bold', 'extrabold', 'black'] as const,
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
        id: 'display-content-required',
        message: 'Display text content is required',
        validator: (value: any) => !!value.children && value.children.length > 0,
      },
    ],
    examples: [],
    
    related: ['heading', 'body'],
    docsUrl: '/docs/components/display',
  };
};

export const displaySchema = createDisplaySchema('sv');
export default displaySchema;
