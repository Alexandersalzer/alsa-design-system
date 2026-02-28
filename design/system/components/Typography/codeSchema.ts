/**
 * Code Component Schema
 */

import { ComponentSchema } from '../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../core/schemas/i18n';
import { codeTranslations } from './i18n-code';
import type { SupportedLocale } from '../../core/schemas/i18n/types';

export const createCodeSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(codeTranslations, locale);
  
  return {
    $id: 'code',
    displayName: t.displayName,
    category: 'typography',
    description: t.description,
    icon: 'CodeBracket',
    tags: ['typography', 'code', 'monospace', 'technical'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      size: 'md',
      color: 'code',
    },
    
    props: {
      content: createLocalizedProp(
        {
          name: 'content',
          type: 'string',
          required: true,
          editorType: 'textarea',
          minLength: 3,
          maxLength: 500,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.content
      ),
      
      size: createLocalizedProp(
        {
          name: 'size',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['lg', 'md', 'sm'] as const,
          group: 'appearance',
        },
        t.props?.size
      ),
    },
    
    validation: [
      {
        id: 'code-content-required',
        message: 'Code content is required',
        validator: (value: any) => !!value.content && value.content.length > 0,
      },
    ],
    examples: [],
    
    related: ['kbd'],
    docsUrl: '/docs/components/code',
  };
};

export const codeSchema = createCodeSchema('sv');
export default codeSchema;
