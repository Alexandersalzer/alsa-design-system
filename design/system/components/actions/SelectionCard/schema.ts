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
    cmsEnabled: false, // Internal UI component
    
    defaultProps: {
      selected: false,
      indicator: 'none',
      orientation: 'vertical',
      size: 'md',
      variant: 'neutral',
      disabled: false,
    },
    
    props: {
      selected: createLocalizedProp(
        {
          name: 'selected',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
        },
        t.props?.selected
      ),
      
      indicator: createLocalizedProp(
        {
          name: 'indicator',
          type: 'enum',
          required: false,
          default: 'none',
          editorType: 'segmented',
          values: ['none', 'checkbox', 'radio'] as const,
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
          group: 'layout',
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
          group: 'appearance',
        },
        t.props?.variant
      ),
      
      disabled: createLocalizedProp(
        {
          name: 'disabled',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
        },
        t.props?.disabled
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
