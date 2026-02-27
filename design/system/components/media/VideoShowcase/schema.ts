/**
 * VideoShowcase Component Schema
 * 
 * Video with device frames and advanced display options
 * Media component - CMS editable
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import type { PropTranslation } from '../../../core/schemas/i18n/types';
import { videoShowcaseTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createVideoShowcaseSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(videoShowcaseTranslations, locale);
  
  return {
    $id: 'videoShowcase',
    displayName: t.displayName,
    category: 'media',
    description: t.description,
    icon: 'PlayCircle',
    tags: ['video', 'media', 'showcase', 'device', 'frame'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      variant: 'elevated',
      size: 'lg',
      aspectRatio: '16-9',
      objectFit: 'contain',
      radius: 'lg',
      showPlayButton: true,
      frame: 'none',
      frameColor: 'black',
    },
    
    props: {
      src: createLocalizedProp(
        {
          name: 'src',
          type: 'string',
          required: false,
          editorType: 'video',
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.src
      ),
      
      poster: createLocalizedProp(
        {
          name: 'poster',
          type: 'string',
          required: false,
          editorType: 'image',
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.poster
      ),
      
      youtubeUrl: createLocalizedProp(
        {
          name: 'youtubeUrl',
          type: 'string',
          required: false,
          editorType: 'url',
          cmsEnabled: true,
          group: 'content',
        },
        (t.props as Record<string, PropTranslation> | undefined)?.youtubeUrl
      ),
      
      aspectRatio: createLocalizedProp(
        {
          name: 'aspectRatio',
          type: 'enum',
          required: false,
          default: '16-9',
          editorType: 'select',
          values: ['16-9', '9-16', '4-3', '4-5', '1-1', '2-3', 'auto'] as const,
          cmsEnabled: false,
          group: 'layout',
        },
        t.props?.aspectRatio
      ),
      
      objectFit: createLocalizedProp(
        {
          name: 'objectFit',
          type: 'enum',
          required: false,
          default: 'contain',
          editorType: 'select',
          values: ['contain', 'cover', 'fill', 'none'] as const,
          cmsEnabled: false,
          group: 'appearance',
        },
        t.props?.objectFit
      ),
      
      radius: createLocalizedProp(
        {
          name: 'radius',
          type: 'enum',
          required: false,
          default: 'lg',
          editorType: 'select',
          values: ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const,
          cmsEnabled: false,
          group: 'appearance',
        },
        t.props?.radius
      ),
      
      showPlayButton: createLocalizedProp(
        {
          name: 'showPlayButton',
          type: 'boolean',
          required: false,
          default: true,
          editorType: 'toggle',
          cmsEnabled: true,
          group: 'behavior',
        },
        t.props?.showPlayButton
      ),
      
      maxHeight: createLocalizedProp(
        {
          name: 'maxHeight',
          type: 'string',
          required: false,
          editorType: 'text',
          placeholder: '600',
          cmsEnabled: false,
          group: 'layout',
        },
        t.props?.maxHeight
      ),
      
      frame: createLocalizedProp(
        {
          name: 'frame',
          type: 'enum',
          required: false,
          default: 'none',
          editorType: 'select',
          values: ['none', 'iphone-14-pro', 'iphone-se', 'pixel-7'] as const,
          cmsEnabled: false,
          group: 'appearance',
        },
        t.props?.frame
      ),
      
      frameColor: createLocalizedProp(
        {
          name: 'frameColor',
          type: 'enum',
          required: false,
          default: 'black',
          editorType: 'segmented',
          values: ['black', 'white', 'silver', 'gold'] as const,
          cmsEnabled: false,
          group: 'appearance',
          visibleWhen: { frame: ['iphone-14-pro', 'iphone-se', 'pixel-7'] },
        },
        t.props?.frameColor
      ),
      
      frameSize: createLocalizedProp(
        {
          name: 'frameSize',
          type: 'number',
          required: false,
          editorType: 'text',
          placeholder: '400',
          cmsEnabled: false,
          group: 'layout',
          visibleWhen: { frame: ['iphone-14-pro', 'iphone-se', 'pixel-7'] },
        },
        t.props?.frameSize
      ),
      
      mobileFrameSize: createLocalizedProp(
        {
          name: 'mobileFrameSize',
          type: 'number',
          required: false,
          editorType: 'text',
          placeholder: '300',
          cmsEnabled: false,
          group: 'layout',
          visibleWhen: { frame: ['iphone-14-pro', 'iphone-se', 'pixel-7'] },
        },
        t.props?.mobileFrameSize
      ),
      
      mobileMaxWidth: createLocalizedProp(
        {
          name: 'mobileMaxWidth',
          type: 'number',
          required: false,
          editorType: 'text',
          placeholder: '400',
          cmsEnabled: false,
          group: 'layout',
        },
        t.props?.mobileMaxWidth
      ),
      
      flagCountry: createLocalizedProp(
        {
          name: 'flagCountry',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 10,
          placeholder: 'se, de, fr...',
          cmsEnabled: false,
          group: 'content',
        },
        t.props?.flagCountry
      ),
    },
    
    validation: [
      {
        id: 'videoShowcase-src-or-poster',
        message: 'Ange minst miniatyrbild (poster) eller video-URL',
        validator: (value: any) => !!(value?.poster || value?.src || value?.youtubeUrl),
      },
    ],
    examples: [],
    
    related: ['video', 'image'],
    docsUrl: '/docs/components/video-showcase',
  };
};

export const videoShowcaseSchema = createVideoShowcaseSchema('sv');
export default videoShowcaseSchema;
