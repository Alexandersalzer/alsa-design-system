/**
 * Heading Component Schema
 * 
 * Heading/typography component
 * Content component - CMS editable
 */

import { ComponentSchema } from '../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../core/schemas/i18n';
import { headingTranslations } from './i18n-heading';
import type { SupportedLocale } from '../../core/schemas/i18n/types';

export const createHeadingSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(headingTranslations, locale);
  
  return {
    $id: 'heading',
    displayName: t.displayName,
    category: 'typography',
    description: t.description,
    icon: 'Heading',
    tags: ['heading', 'title', 'typography', 'text'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      content: t.defaultContent,
      variant: 'h2',
      weight: 'bold',
      align: 'left',
    },
    
    props: {
      content: createLocalizedProp(
        {
          name: 'content',
          type: 'string',
          required: true,
          default: t.defaultContent,
          editorType: 'textarea',
          minLength: 3,
          maxLength: 60,
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
          default: 'h2',
          editorType: 'select',
          values: ['display-2xl', 'display-xl', 'display-lg', 'display-md', 'display-sm', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const,
          group: 'appearance',
        },
        t.props?.variant
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
          default: 'left',
          editorType: 'segmented',
          values: ['left', 'center', 'right', 'justify'] as const,
          group: 'layout',
        },
        t.props?.align
      ),
    },
    
    validation: [
      {
        id: 'heading-content-required',
        message: 'Heading text is required',
        validator: (value: any) => !!value.content && value.content.length > 0,
      },
    ],
    examples: [],
    
    related: ['body', 'label'],
    docsUrl: '/docs/components/typography',
  };
};

export const headingSchema = createHeadingSchema('sv');
export default headingSchema;
