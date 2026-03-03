/**
 * Image Component Schema
 * 
 * Responsive image with lazy loading
 * Content component - CMS editable
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { imageTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createImageSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(imageTranslations, locale);
  
  return {
    $id: 'image',
    displayName: t.displayName,
    category: 'media',
    description: t.description,
    icon: 'Photo',
    tags: ['image', 'media', 'photo', 'picture'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      src: t.defaultSrc,
      objectFit: 'cover',
      radius: 'none',
      loading: 'lazy',
      priority: false,
      hoverZoom: false,
    },
    
    props: {
      src: createLocalizedProp(
        {
          name: 'src',
          type: 'string',
          required: true,
          editorType: 'url',
          cmsEnabled: false, // Hidden - use Media Gallery instead
          group: 'content',
        },
        t.props?.src
      ),
      
      alt: createLocalizedProp(
        {
          name: 'alt',
          type: 'string',
          required: true,
          editorType: 'text',
          maxLength: 150,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.alt
      ),
      
      width: createLocalizedProp(
        {
          name: 'width',
          type: 'string',
          required: false,
          editorType: 'text',
          group: 'layout',
        },
        t.props?.width
      ),
      
      height: createLocalizedProp(
        {
          name: 'height',
          type: 'string',
          required: false,
          editorType: 'text',
          group: 'layout',
        },
        t.props?.height
      ),
      
      objectFit: createLocalizedProp(
        {
          name: 'objectFit',
          type: 'enum',
          required: false,
          default: 'cover',
          editorType: 'segmented',
          values: ['cover', 'contain', 'fill', 'none', 'scale-down'] as const,
          group: 'appearance',
        },
        t.props?.objectFit
      ),
      
      radius: createLocalizedProp(
        {
          name: 'radius',
          type: 'enum',
          required: false,
          default: 'none',
          editorType: 'select',
          values: ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const,
          group: 'appearance',
        },
        t.props?.radius
      ),
      
      aspectRatio: createLocalizedProp(
        {
          name: 'aspectRatio',
          type: 'string',
          required: false,
          editorType: 'text',
          group: 'layout',
        },
        t.props?.aspectRatio
      ),
      
      loading: createLocalizedProp(
        {
          name: 'loading',
          type: 'enum',
          required: false,
          default: 'lazy',
          editorType: 'segmented',
          values: ['lazy', 'eager'] as const,
          group: 'behavior',
        },
        t.props?.loading
      ),
      
      priority: createLocalizedProp(
        {
          name: 'priority',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.priority
      ),
      
      hoverZoom: createLocalizedProp(
        {
          name: 'hoverZoom',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.hoverZoom
      ),
    },
    
    validation: [
      {
        id: 'image-src-required',
        message: 'Image source is required',
        validator: (value: any) => !!value.src,
      },
      {
        id: 'image-alt-required',
        message: 'Alt text is required for accessibility',
        validator: (value: any) => !!value.alt,
      },
    ],
    examples: [],
    
    related: ['video', 'logo', 'avatar'],
    docsUrl: '/docs/components/image',
  };
};

export const imageSchema = createImageSchema('sv');
export default imageSchema;
