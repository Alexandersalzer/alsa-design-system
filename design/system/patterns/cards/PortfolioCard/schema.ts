/**
 * Portfolio Component Schema
 * Används i portfolioCarousel / portfolioGrid. Styr om objektet är bild eller video.
 * Dashboard använder schemat för smart redigering och för att sätta mediaType vid val av media.
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { createLocalizedProp } from '../../../core/schemas/i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createPortfolioSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  return {
    $id: 'portfolio',
    displayName: 'Portfolio',
    category: 'media',
    description: 'Ett portfolio-objekt (bild eller video) i karusell eller grid.',
    icon: 'Photo',
    tags: ['portfolio', 'media', 'image', 'video', 'carousel'],
    version: '1.0.0',
    cmsEnabled: true,

    defaultProps: {
      mediaType: 'image',
      title: '',
    },

    props: {
      mediaType: createLocalizedProp(
        {
          name: 'mediaType',
          type: 'enum',
          required: true,
          default: 'image',
          editorType: 'segmented',
          values: ['image', 'video'] as const,
          group: 'content',
          editorHint: 'Välj om detta objekt är en bild eller en video.',
        },
        undefined
      ),
      mediaSrc: createLocalizedProp(
        {
          name: 'mediaSrc',
          type: 'string',
          required: true,
          editorType: 'url',
          cmsEnabled: false, // Hanteras via Media Gallery i dashboard
          group: 'content',
        },
        undefined
      ),
      posterSrc: createLocalizedProp(
        {
          name: 'posterSrc',
          type: 'string',
          required: false,
          editorType: 'url',
          cmsEnabled: false,
          group: 'content',
          editorHint: 'Thumbnail för video (lämna tom för auto).',
        },
        undefined
      ),
      title: createLocalizedProp(
        {
          name: 'title',
          type: 'string',
          required: false,
          editorType: 'text',
          group: 'content',
        },
        undefined
      ),
      mediaAlt: createLocalizedProp(
        {
          name: 'mediaAlt',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 150,
          group: 'content',
        },
        undefined
      ),
    },

    validation: [
      {
        id: 'portfolio-mediaSrc-required',
        message: 'Media source (mediaSrc) is required',
        validator: (value: any) => !!value?.mediaSrc,
      },
    ],
    examples: [],
    related: ['image', 'videoShowcase'],
    docsUrl: '/docs/components/portfolio',
  };
};

export const portfolioSchema = createPortfolioSchema('sv');
export default portfolioSchema;
