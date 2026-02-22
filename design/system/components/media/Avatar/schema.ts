/**
 * Avatar Component Schema
 *
 * Defines the complete schema for the Avatar component including:
 * - All available props with types and validation
 * - Default values (language-specific)
 * - CMS editor configuration
 * - Usage examples
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { avatarTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

/**
 * Create a localized Avatar schema
 * @param locale - Locale code (e.g., 'sv', 'en')
 * @returns ComponentSchema with localized strings
 */
export const createAvatarSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(avatarTranslations, locale);

  return {
    $id: 'avatar',
    displayName: t.displayName,
    category: 'media',
    description: t.description,
    icon: 'UserCircle',
    tags: ['profile', 'image', 'user', 'photo'],
    version: '1.0.0',
    cmsEnabled: true,

    defaultProps: {
      size: 'md',
      shape: 'full',
      variant: 'subtle',
      colorPalette: 'gray',
      borderless: false,
      badgePlacement: 'bottom-right',
      badgeSize: 'md',
    },

    props: {
      src: createLocalizedProp(
        {
          name: 'src',
          type: 'string',
          required: false,
          editorType: 'image',
          group: 'content',
          cmsEnabled: true,
        },
        t.props?.src
      ),

      alt: createLocalizedProp(
        {
          name: 'alt',
          type: 'string',
          required: false,
          editorType: 'text',
          group: 'content',
          cmsEnabled: true,
        },
        t.props?.alt
      ),

      name: createLocalizedProp(
        {
          name: 'name',
          type: 'string',
          required: false,
          editorType: 'text',
          group: 'content',
          cmsEnabled: true,
        },
        t.props?.name
      ),

      size: createLocalizedProp(
        {
          name: 'size',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', 'full'] as const,
          group: 'appearance',
        },
        t.props?.size
      ),

      shape: createLocalizedProp(
        {
          name: 'shape',
          type: 'enum',
          required: false,
          default: 'full',
          editorType: 'segmented',
          values: ['full', 'rounded', 'square'] as const,
          group: 'appearance',
        },
        t.props?.shape
      ),

      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'subtle',
          editorType: 'segmented',
          values: ['solid', 'subtle', 'outline'] as const,
          group: 'appearance',
        },
        t.props?.variant
      ),

      colorPalette: createLocalizedProp(
        {
          name: 'colorPalette',
          type: 'enum',
          required: false,
          default: 'gray',
          editorType: 'select',
          values: ['gray', 'red', 'orange', 'yellow', 'green', 'teal', 'blue', 'cyan', 'purple', 'pink'] as const,
          group: 'appearance',
          visibleWhen: {
            property: 'src',
            operator: 'notExists',
          },
        },
        t.props?.colorPalette
      ),

      borderless: createLocalizedProp(
        {
          name: 'borderless',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'appearance',
        },
        t.props?.borderless
      ),

      badgeImageSrc: createLocalizedProp(
        {
          name: 'badgeImageSrc',
          type: 'string',
          required: false,
          editorType: 'image',
          group: 'badge',
          cmsEnabled: true,
        },
        t.props?.badgeImageSrc
      ),

      badgeImageAlt: createLocalizedProp(
        {
          name: 'badgeImageAlt',
          type: 'string',
          required: false,
          editorType: 'text',
          group: 'badge',
          visibleWhen: {
            property: 'badgeImageSrc',
            operator: 'exists',
          },
        },
        t.props?.badgeImageAlt
      ),

      badgePlacement: createLocalizedProp(
        {
          name: 'badgePlacement',
          type: 'enum',
          required: false,
          default: 'bottom-right',
          editorType: 'select',
          values: ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const,
          group: 'badge',
          visibleWhen: {
            property: 'badgeImageSrc',
            operator: 'exists',
          },
        },
        t.props?.badgePlacement
      ),

      badgeSize: createLocalizedProp(
        {
          name: 'badgeSize',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['sm', 'md', 'lg'] as const,
          group: 'badge',
          visibleWhen: {
            property: 'badgeImageSrc',
            operator: 'exists',
          },
        },
        t.props?.badgeSize
      ),
    },

    examples: [
      {
        name: t.examples?.['basic']?.name || 'Basic Avatar',
        description: t.examples?.['basic']?.description || 'Avatar with profile image',
        category: t.examples?.['basic']?.category || 'common',
        data: {
          type: 'avatar',
          props: {
            src: 'https://example.com/photo.jpg',
            alt: 'Jane Doe',
            size: 'md',
            shape: 'full',
          },
        },
      },
      {
        name: t.examples?.['initials']?.name || 'Initials Fallback',
        description: t.examples?.['initials']?.description || 'Avatar showing initials when no image is set',
        category: t.examples?.['initials']?.category || 'common',
        data: {
          type: 'avatar',
          props: {
            name: 'Alexander Salzer',
            size: 'md',
            shape: 'full',
            colorPalette: 'purple',
          },
        },
      },
      {
        name: t.examples?.['with-badge']?.name || 'Avatar with Logo Badge',
        description: t.examples?.['with-badge']?.description || 'Profile photo with a brand logo badge overlay',
        category: t.examples?.['with-badge']?.category || 'branded',
        data: {
          type: 'avatar',
          props: {
            src: 'https://example.com/photo.jpg',
            alt: 'Alexander Salzer',
            size: '3xl',
            shape: 'full',
            badgeImageSrc: 'https://cdn.blimpify-im.com/assets/logo/logo.png',
            badgeImageAlt: 'Blimpify',
            badgePlacement: 'bottom-right',
            badgeSize: 'md',
          },
        },
      },
      {
        name: t.examples?.['large']?.name || 'Large Hero Avatar',
        description: t.examples?.['large']?.description || 'Oversized avatar for hero/profile sections',
        category: t.examples?.['large']?.category || 'layout',
        data: {
          type: 'avatar',
          props: {
            src: 'https://example.com/photo.jpg',
            alt: 'Profile',
            size: '4xl',
            shape: 'full',
          },
        },
      },
    ],

    related: ['badge', 'image'],
    docsUrl: '/docs/components/avatar',
  };
};

// Default export with Swedish locale
export const avatarSchema = createAvatarSchema('sv');

export default avatarSchema;
