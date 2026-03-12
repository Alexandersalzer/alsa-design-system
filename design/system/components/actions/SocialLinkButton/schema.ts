import { ComponentSchema } from '../../../core/schemas/component.types';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createSocialLinkButtonSchema = (_locale: SupportedLocale = 'sv'): ComponentSchema => {
  return {
    $id: 'socialLinkButton',
    displayName: 'Social Link Button',
    category: 'actions',
    description: 'A button-style link showing a social platform logo and optional label. Ideal for profile / linktree pages.',
    icon: 'Link',
    tags: ['link', 'social', 'profile', 'button'],
    version: '1.0.0',
    cmsEnabled: true,

    defaultProps: {
      platform: 'instagram',
      href: '#',
      target: '_blank',
      variant: 'ghost',
      size: 'md',
      radius: 'full',
      fullWidth: false,
      iconColor: 'auto',
    },

    props: {
      platform: {
        name: 'platform',
        displayName: 'Platform',
        type: 'enum',
        required: false,
        editorType: 'select',
        values: ['tiktok', 'instagram', 'facebook', 'twitter', 'x', 'youtube', 'linkedin', 'pinterest', 'snapchat', 'threads'] as const,
        group: 'content',
        cmsEnabled: true,
      },

      content: {
        name: 'content',
        displayName: 'Label',
        type: 'string',
        required: false,
        editorType: 'text',
        maxLength: 60,
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

      variant: {
        name: 'variant',
        displayName: 'Style',
        type: 'enum',
        required: false,
        editorType: 'segmented',
        values: ['primary', 'secondary', 'ghost'] as const,
        group: 'appearance',
        cmsEnabled: true,
      },

      size: {
        name: 'size',
        displayName: 'Size',
        type: 'enum',
        required: false,
        editorType: 'segmented',
        values: ['sm', 'md', 'lg'] as const,
        group: 'appearance',
        cmsEnabled: true,
      },

      radius: {
        name: 'radius',
        displayName: 'Radius',
        type: 'enum',
        required: false,
        editorType: 'select',
        values: ['none', 'sm', 'md', 'lg', 'full'] as const,
        group: 'appearance',
        cmsEnabled: true,
      },

      fullWidth: {
        name: 'fullWidth',
        displayName: 'Full width',
        type: 'boolean',
        required: false,
        editorType: 'toggle',
        group: 'layout',
        cmsEnabled: true,
      },

      iconColor: {
        name: 'iconColor',
        displayName: 'Icon color',
        type: 'enum',
        required: false,
        editorType: 'select',
        values: ['auto', 'light', 'dark'] as const,
        group: 'appearance',
        cmsEnabled: true,
      },

      imageSrc: {
        name: 'imageSrc',
        displayName: 'Custom icon URL',
        type: 'string',
        required: false,
        editorType: 'url',
        group: 'content',
        cmsEnabled: true,
      },

      imageAlt: {
        name: 'imageAlt',
        displayName: 'Custom icon alt text',
        type: 'string',
        required: false,
        editorType: 'text',
        group: 'content',
        cmsEnabled: true,
      },
    },

    validation: [],
    related: ['button', 'socialIcon', 'link'],
  };
};

export const socialLinkButtonSchema = createSocialLinkButtonSchema('sv');
export default socialLinkButtonSchema;
