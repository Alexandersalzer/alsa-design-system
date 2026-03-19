/**
 * SelectionCard Component Schema
 * 
 * Interactive card for selections
 * Used internally in dashboard/CMS interfaces
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { selectionCardTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createSelectionCardSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(selectionCardTranslations, locale);
  
  return {
    $id: 'selectionCard',
    displayName: t.displayName,
    category: 'actions',
    description: t.description,
    icon: 'RectangleStack',
    tags: ['card', 'selection', 'checkbox', 'radio', 'interactive'],
    version: '1.0.0',
    cmsEnabled: true,

    defaultProps: {
      label: '',
      indicator: 'none',
      orientation: 'vertical',
      size: 'md',
      variant: 'neutral',
      disabled: false,
    },

    props: {
      content: createLocalizedProp(
        {
          name: 'content',
          type: 'string',
          required: false,
          default: '',
          editorType: 'text',
          maxLength: 80,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.label
      ),

      disabled: createLocalizedProp(
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.disabled
      ),

      indicator: createLocalizedProp(
        {
          name: 'indicator',
          type: 'enum',
          required: false,
          default: 'none',
          editorType: 'segmented',
          values: ['none', 'checkbox', 'radio'] as const,
          cmsEnabled: false,
          group: 'appearance',
        },
        t.props?.indicator
      ),

      orientation: createLocalizedProp(
        {
          name: 'orientation',
          type: 'enum',
          required: false,
          default: 'vertical',
          editorType: 'segmented',
          values: ['horizontal', 'vertical'] as const,
          cmsEnabled: false,
          group: 'appearance',
        },
        t.props?.orientation
      ),

      size: createLocalizedProp(
        {
          name: 'size',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['sm', 'md', 'lg'] as const,
          cmsEnabled: false,
          group: 'appearance',
        },
        t.props?.size
      ),

      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'neutral',
          editorType: 'segmented',
          values: ['neutral', 'accent'] as const,
          cmsEnabled: false,
          group: 'appearance',
        },
        t.props?.variant
      ),

      selected: createLocalizedProp(
        {
          name: 'selected',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          cmsEnabled: false,
          group: 'state',
        },
        t.props?.selected
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['checkbox', 'radio', 'card'],
    docsUrl: '/docs/components/selection-card',
  };
};

export const selectionCardSchema = createSelectionCardSchema('sv');
export default selectionCardSchema;
