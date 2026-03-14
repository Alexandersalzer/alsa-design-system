import { ComponentSchema } from '../../../core/schemas/component.types';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createSocialIconSchema = (_locale: SupportedLocale = 'sv'): ComponentSchema => {
  return {
    $id: 'socialIcon',
    displayName: 'Social Icon',
    category: 'media',
    description: 'A social media platform icon, optionally wrapped in a link.',
    icon: 'Link',
    tags: ['social', 'icon', 'link'],
    version: '1.0.0',
    cmsEnabled: true,

    defaultProps: {
      platform: 'instagram',
      size: 'md',
      color: 'auto',
      href: '#',
      target: '_blank',
    },

    props: {
      platform: {
        name: 'platform',
        displayName: 'Platform',
        type: 'enum',
        required: true,
        editorType: 'select',
        values: ['tiktok', 'instagram', 'facebook', 'twitter', 'x', 'youtube', 'linkedin', 'pinterest', 'snapchat', 'threads'] as const,
        group: 'content',
        cmsEnabled: true,
      },

      href: {
        name: 'href',
        displayName: 'URL',
        type: 'string',
        required: false,
        editorType: 'url',
        group: 'navigation',
        cmsEnabled: true,
      },

      target: {
        name: 'target',
        displayName: 'Open in',
        type: 'enum',
        required: false,
        editorType: 'select',
        values: ['_blank', '_self'] as const,
        group: 'navigation',
        cmsEnabled: true,
      },

      size: {
        name: 'size',
        displayName: 'Size',
        type: 'enum',
        required: false,
        editorType: 'segmented',
        values: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const,
        group: 'appearance',
        cmsEnabled: true,
      },

      color: {
        name: 'color',
        displayName: 'Color',
        type: 'enum',
        required: false,
        editorType: 'select',
        values: ['auto', 'light', 'dark'] as const,
        group: 'appearance',
        cmsEnabled: true,
      },
    },

    validation: [],
    related: ['socialLinkButton', 'link'],
  };
};

export const socialIconSchema = createSocialIconSchema('sv');
export default socialIconSchema;
