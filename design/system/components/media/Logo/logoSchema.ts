/**
 * Logo Component Schema
 * 
 * Logo image component with color/inversion controls
 * Content component - CMS editable
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

// Translations for logo component
const logoTranslations = {
  sv: {
    displayName: 'Logo',
    description: 'Logotyp med färgkontroll',
    props: {
      color: {
        displayName: 'Logga',
        description: 'Välj om loggan är gjord för ljus eller mörk bakgrund',
        valueLabels: {
          light: 'Ljus',
          dark: 'Mörk',
          brand: 'Brand',
        },
      },
      radius: {
        displayName: 'Rundning',
        description: 'Hörnavrundning',
        valueLabels: {
          none: '—',
          sm: 'S',
          md: 'M',
          lg: 'L',
          xl: 'XL',
          full: '○',
        },
      },
    },
  },
  en: {
    displayName: 'Logo',
    description: 'Logo image with color control',
    props: {
      color: {
        displayName: 'Logo',
        description: 'Whether the logo is designed for a light or dark background',
        valueLabels: {
          light: 'Light',
          dark: 'Dark',
          brand: 'Brand',
        },
      },
      radius: {
        displayName: 'Radius',
        description: 'Corner rounding',
        valueLabels: {
          none: '—',
          sm: 'S',
          md: 'M',
          lg: 'L',
          xl: 'XL',
          full: '○',
        },
      },
    },
  },
};

export const createLogoSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(logoTranslations, locale);
  
  return {
    $id: 'logo',
    displayName: t.displayName,
    category: 'media',
    description: t.description,
    icon: 'Image',
    tags: ['logo', 'brand', 'image', 'icon'],
    version: '1.0.0',
    cmsEnabled: true,
    
    defaultProps: {
      alt: 'Logo',
      color: 'light',
      radius: 'none',
      border: 'none',
      loading: 'lazy',
      priority: false,
    },
    
    props: {
      src: createLocalizedProp(
        {
          name: 'src',
          type: 'string',
          required: true,
          editorType: 'media',
          cmsEnabled: false,
          group: 'content',
        },
        undefined
      ),

      alt: createLocalizedProp(
        {
          name: 'alt',
          type: 'string',
          required: false,
          default: 'Logo',
          editorType: 'text',
          maxLength: 100,
          cmsEnabled: false,
          group: 'content',
        },
        undefined
      ),

      color: createLocalizedProp(
        {
          name: 'color',
          type: 'enum',
          required: false,
          default: 'light',
          editorType: 'segmented',
          values: ['light', 'dark', 'brand'] as const,
          cmsEnabled: true,
          group: 'appearance',
        },
        t.props?.color
      ),

      radius: createLocalizedProp(
        {
          name: 'radius',
          type: 'enum',
          required: false,
          default: 'none',
          editorType: 'segmented',
          values: ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const,
          cmsEnabled: true,
          group: 'appearance',
        },
        t.props?.radius
      ),

      border: createLocalizedProp(
        {
          name: 'border',
          type: 'enum',
          required: false,
          default: 'none',
          editorType: 'segmented',
          values: ['none', 'default', 'subtle', 'strong', 'emphasis'] as const,
          cmsEnabled: false,
          group: 'appearance',
        },
        undefined
      ),
    },
    
    validation: [
      {
        id: 'logo-src-required',
        message: 'Logo image URL is required',
        validator: (value: any) => !!value.src && value.src.trim().length > 0,
      },
    ],
    examples: [],
    
    related: ['logotext', 'image', 'avatar'],
    docsUrl: '/docs/components/logo',
  };
};

export const logoSchema = createLogoSchema('sv');
export default logoSchema;
