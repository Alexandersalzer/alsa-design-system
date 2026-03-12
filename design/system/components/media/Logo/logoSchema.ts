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
        description: 'Välj hur loggan anpassar sig till temat',
        valueLabels: {
          auto: 'Auto',
          inverse: 'Inverse',
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
      display: {
        displayName: 'Visa',
        description: 'Vad som ska visas',
        valueLabels: {
          both: 'Båda',
          logo: 'Logga',
          text: 'Text',
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
        description: 'How the logo adapts to the theme',
        valueLabels: {
          auto: 'Auto',
          inverse: 'Inverse',
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
      display: {
        displayName: 'Display',
        description: 'What to show',
        valueLabels: {
          both: 'Both',
          logo: 'Logo',
          text: 'Text',
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
      color: 'auto',
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
          default: 'auto',
          editorType: 'segmented',
          values: ['auto', 'inverse', 'brand'] as const,
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

      display: createLocalizedProp(
        {
          name: 'display',
          type: 'enum',
          required: false,
          default: 'both',
          editorType: 'segmented',
          values: ['both', 'logo', 'text'] as const,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.display
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
