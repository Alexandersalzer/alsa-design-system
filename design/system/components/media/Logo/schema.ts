/**
 * LogoText Component Schema
 * 
 * Branded text for logos and headings
 * Content component - CMS editable
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { logotextTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createLogotextSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(logotextTranslations, locale);
  
  return {
    $id: 'logotext',
    displayName: t.displayName,
    category: 'media',
    description: t.description,
    icon: 'Type',
    tags: ['logotext', 'brand', 'text', 'typography'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      size: 'lg',
      weight: 'extrabold',
      transform: 'none',
      spacing: 'normal',
      color: 'primary',
      font: 'brand',
      gradient: false,
      gradientDirection: 'to-r',
      hover: true,
    },
    
    props: {
      content: createLocalizedProp(
        {
          name: 'content',
          type: 'string',
          required: true,
          editorType: 'text',
          maxLength: 100,
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
          default: 'lg',
          editorType: 'select',
          values: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const,
          cmsEnabled: true,
          group: 'appearance',
        },
        t.props?.size
      ),

      weight: createLocalizedProp(
        {
          name: 'weight',
          type: 'enum',
          required: false,
          default: 'extrabold',
          editorType: 'select',
          values: ['normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'] as const,
          cmsEnabled: true,
          group: 'appearance',
        },
        t.props?.weight
      ),

      transform: createLocalizedProp(
        {
          name: 'transform',
          type: 'enum',
          required: false,
          default: 'none',
          editorType: 'segmented',
          values: ['none', 'uppercase', 'lowercase', 'capitalize'] as const,
          group: 'appearance',
        },
        t.props?.transform
      ),

      spacing: createLocalizedProp(
        {
          name: 'spacing',
          type: 'enum',
          required: false,
          default: 'normal',
          editorType: 'select',
          values: ['normal', 'tight', 'wide', 'wider', 'widest'] as const,
          group: 'appearance',
        },
        t.props?.spacing
      ),

      color: createLocalizedProp(
        {
          name: 'color',
          type: 'enum',
          required: false,
          default: 'primary',
          editorType: 'segmented',
          values: ['auto', 'auto-inverse', 'inverse', 'primary', 'secondary', 'inherit'] as const,
          cmsEnabled: true,
          group: 'appearance',
        },
        t.props?.color
      ),

      font: createLocalizedProp(
        {
          name: 'font',
          type: 'enum',
          required: false,
          default: 'brand',
          editorType: 'segmented',
          values: ['brand', 'heading', 'body', 'mono'] as const,
          group: 'appearance',
        },
        t.props?.font
      ),

      gradient: createLocalizedProp(
        {
          name: 'gradient',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          cmsEnabled: true,
          group: 'appearance',
        },
        t.props?.gradient
      ),
      
      gradientDirection: createLocalizedProp(
        {
          name: 'gradientDirection',
          type: 'enum',
          required: false,
          default: 'to-r',
          editorType: 'select',
          values: ['to-r', 'to-br', 'to-b', 'to-bl', 'to-l'] as const,
          group: 'appearance',
        },
        t.props?.gradientDirection
      ),
      
      hover: createLocalizedProp(
        {
          name: 'hover',
          type: 'boolean',
          required: false,
          default: true,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.hover
      ),
    },
    
    validation: [
      {
        id: 'logotext-content-required',
        message: 'Text content is required',
        validator: (value: any) => !!value.content && value.content.trim().length > 0,
      },
    ],
    examples: [],
    
    related: ['logo', 'heading', 'body'],
    docsUrl: '/docs/components/logotext',
  };
};

export const logotextSchema = createLogotextSchema('sv');
export default logotextSchema;
