/**
 * NumberDisplay Component Schema
 *
 * Displays numbers with button-like variants
 * Feedback component
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { numberDisplayTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createNumberDisplaySchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(numberDisplayTranslations, locale);

  return {
    $id: 'numberDisplay',
    displayName: t.displayName,
    category: 'feedback',
    description: t.description,
    icon: 'Hash',
    tags: ['number', 'display', 'indicator', 'step'],
    version: '1.0.0',
    cmsEnabled: false,

    defaultProps: {
      value: '01',
      variant: 'bare',
      size: 'md',
      shape: 'rounded',
    },

    props: {
      value: createLocalizedProp(
        {
          name: 'value',
          type: 'string',
          required: true,
          default: '01',
          editorType: 'text',
          maxLength: 4,
          cmsEnabled: false,
          group: 'content',
        },
        t.props?.value
      ),

      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'bare',
          editorType: 'select',
          values: ['brand', 'primary', 'secondary', 'accent', 'ghost', 'raised', 'bare'] as const,
          group: 'appearance',
        },
        t.props?.variant
      ),

      size: createLocalizedProp(
        {
          name: 'size',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['sm', 'md', 'lg', 'xl'] as const,
          group: 'appearance',
        },
        t.props?.size
      ),

      shape: createLocalizedProp(
        {
          name: 'shape',
          type: 'enum',
          required: false,
          default: 'rounded',
          editorType: 'segmented',
          values: ['square', 'rounded', 'circle'] as const,
          group: 'appearance',
        },
        t.props?.shape
      ),
    },

    validation: [],
    examples: [],

    related: ['badge', 'tag'],
    docsUrl: '/docs/components/number-display',
  };
};

export const numberDisplaySchema = createNumberDisplaySchema('sv');
export default numberDisplaySchema;
