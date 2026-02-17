/**
 * Label Component Schema
 */

import { ComponentSchema } from '../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../core/schemas/i18n';
import { labelTranslations } from './i18n-label';
import type { SupportedLocale } from '../../core/schemas/i18n/types';

export const createLabelSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(labelTranslations, locale);
  
  return {
    $id: 'label',
    displayName: t.displayName,
    category: 'typography',
    description: t.description,
    icon: 'Tag',
    tags: ['typography', 'label', 'text', 'small'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      size: 'md',
      color: 'label',
      weight: 'medium',
    },
    
    props: {
      children: createLocalizedProp(
        {
          name: 'children',
          type: 'string',
          required: true,
          editorType: 'input',
          cmsEnabled: true,
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
          values: ['lg', 'md', 'sm', 'xs'] as const,
          group: 'appearance',
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
        },
        t.props?.weight
      ),
    },
    
    validation: [
      {
        id: 'label-content-required',
        message: 'Label text content is required',
        validator: (value: any) => !!value.children && value.children.length > 0,
      },
    ],
    examples: [],
    
    related: ['body', 'badge'],
    docsUrl: '/docs/components/label',
  };
};

export const labelSchema = createLabelSchema('sv');
export default labelSchema;
