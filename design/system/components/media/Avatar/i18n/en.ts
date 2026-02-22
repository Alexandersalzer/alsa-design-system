/**
 * English translations for Avatar component
 */

import type { ComponentTranslation } from '../../../../core/schemas/i18n/types';

export const en: ComponentTranslation = {
  displayName: 'Avatar',
  description: 'User profile image component with fallback initials, badge overlay, and multiple size options',

  props: {
    src: {
      displayName: 'Image URL',
      description: 'URL of the profile image',
      placeholder: 'https://example.com/photo.jpg',
      editorHint: 'Leave empty to show initials or icon fallback',
    },

    alt: {
      displayName: 'Alt Text',
      description: 'Accessible description of the image',
      placeholder: "User's name or description",
    },

    name: {
      displayName: 'Name',
      description: 'Used to generate initials when no image is provided',
      placeholder: 'Alexander Salzer',
    },

    size: {
      displayName: 'Size',
      description: 'Avatar dimensions',
      valueLabels: {
        '2xs': 'Extra Extra Small (24px)',
        xs: 'Extra Small (32px)',
        sm: 'Small (40px)',
        md: 'Medium (48px)',
        lg: 'Large (56px)',
        xl: 'Extra Large (64px)',
        '2xl': '2X Large (80px)',
        '3xl': '3X Large (112px)',
        '4xl': '4X Large (140px)',
        full: 'Full (100%)',
      },
    },

    shape: {
      displayName: 'Shape',
      description: 'Border radius of the avatar',
      valueLabels: {
        full: 'Circle',
        rounded: 'Rounded',
        square: 'Square',
      },
    },

    variant: {
      displayName: 'Variant',
      description: 'Background style when showing fallback',
      valueLabels: {
        solid: 'Solid',
        subtle: 'Subtle',
        outline: 'Outline',
      },
    },

    colorPalette: {
      displayName: 'Color',
      description: 'Color palette for the fallback background',
      valueLabels: {
        gray: 'Gray',
        red: 'Red',
        orange: 'Orange',
        yellow: 'Yellow',
        green: 'Green',
        teal: 'Teal',
        blue: 'Blue',
        cyan: 'Cyan',
        purple: 'Purple',
        pink: 'Pink',
      },
    },

    borderless: {
      displayName: 'Borderless',
      description: 'Remove the border ring from the avatar',
      trueLabel: 'No border',
      falseLabel: 'With border',
    },

    badgeImageSrc: {
      displayName: 'Badge Image URL',
      description: 'URL of an image to overlay as a badge (e.g. a logo or platform icon)',
      placeholder: 'https://example.com/logo.png',
      editorHint: 'Leave empty to show no badge',
    },

    badgeImageAlt: {
      displayName: 'Badge Alt Text',
      description: 'Accessible description of the badge image',
      placeholder: 'Brand logo',
    },

    badgePlacement: {
      displayName: 'Badge Position',
      description: 'Where to place the badge relative to the avatar',
      valueLabels: {
        'top-right': 'Top Right',
        'top-left': 'Top Left',
        'bottom-right': 'Bottom Right',
        'bottom-left': 'Bottom Left',
      },
    },

    badgeSize: {
      displayName: 'Badge Size',
      description: 'Size of the badge overlay',
      valueLabels: {
        sm: 'Small (20px)',
        md: 'Medium (28px)',
        lg: 'Large (36px)',
      },
    },
  },

  examples: {
    'basic': {
      name: 'Basic Avatar',
      description: 'Avatar with profile image',
      category: 'common',
    },
    'initials': {
      name: 'Initials Fallback',
      description: 'Avatar showing initials when no image is set',
      category: 'common',
    },
    'with-badge': {
      name: 'Avatar with Logo Badge',
      description: 'Profile photo with a brand logo badge overlay',
      category: 'branded',
    },
    'large': {
      name: 'Large Hero Avatar',
      description: 'Oversized avatar for hero/profile sections',
      category: 'layout',
    },
  },
};
