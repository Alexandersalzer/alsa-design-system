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
      src: {
        displayName: 'Bild URL',
        description: 'URL till logotypbilden',
      },
      alt: {
        displayName: 'Alt-text',
        description: 'Beskrivande text för tillgänglighet',
      },
      color: {
        displayName: 'Färg',
        description: 'Kontrollerar om logotypen inverteras i mörkt/ljust läge',
        valueLabels: {
          auto: 'Auto',
          inverse: 'Invers',
          brand: 'Brand',
        },
      },
      radius: {
        displayName: 'Rundning',
        description: 'Hörnavrundning',
        valueLabels: {
          none: 'Ingen',
          sm: 'Liten',
          md: 'Mellan',
          lg: 'Stor',
          xl: 'Extra stor',
          full: 'Cirkel',
        },
      },
      border: {
        displayName: 'Ram',
        description: 'Ramstil',
        valueLabels: {
          none: 'Ingen',
          default: 'Standard',
          subtle: 'Subtil',
          strong: 'Stark',
          emphasis: 'Betoning',
        },
      },
    },
  },
  en: {
    displayName: 'Logo',
    description: 'Logo image with color control',
    props: {
      src: {
        displayName: 'Image URL',
        description: 'URL to the logo image',
      },
      alt: {
        displayName: 'Alt text',
        description: 'Descriptive text for accessibility',
      },
      color: {
        displayName: 'Color',
        description: 'Controls whether logo inverts in dark/light mode',
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
          none: 'None',
          sm: 'Small',
          md: 'Medium',
          lg: 'Large',
          xl: 'Extra large',
          full: 'Circle',
        },
      },
      border: {
        displayName: 'Border',
        description: 'Border style',
        valueLabels: {
          none: 'None',
          default: 'Default',
          subtle: 'Subtle',
          strong: 'Strong',
          emphasis: 'Emphasis',
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
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.src
      ),
      
      alt: createLocalizedProp(
        {
          name: 'alt',
          type: 'string',
          required: false,
          default: 'Logo',
          editorType: 'text',
          maxLength: 100,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.alt
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
          cmsEnabled: true,
          group: 'appearance',
        },
        t.props?.border
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
