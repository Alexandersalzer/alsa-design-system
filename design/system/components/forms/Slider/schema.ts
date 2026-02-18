/**
 * Slider Component Schema
 * 
 * Range slider for numeric value selection
 * Form control component
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { sliderTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createSliderSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(sliderTranslations, locale);
  
  return {
    $id: 'slider',
    displayName: t.displayName,
    category: 'forms',
    description: t.description,
    icon: 'AdjustmentsHorizontal',
    tags: ['slider', 'range', 'form', 'numeric'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      size: 'md',
      color: 'primary',
      showSteps: false,
      showTooltip: false,
      disabled: false,
    },
    
    props: {
      label: createLocalizedProp(
        {
          name: 'label',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 100,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.label
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
      
      color: createLocalizedProp(
        {
          name: 'color',
          type: 'enum',
          required: false,
          default: 'primary',
          editorType: 'select',
          values: ['primary', 'secondary', 'success', 'warning', 'danger'] as const,
          group: 'appearance',
        },
        t.props?.color
      ),
      
      showSteps: createLocalizedProp(
        {
          name: 'showSteps',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.showSteps
      ),
      
      showTooltip: createLocalizedProp(
        {
          name: 'showTooltip',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.showTooltip
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
    
    related: ['input'],
    docsUrl: '/docs/components/slider',
  };
};

export const sliderSchema = createSliderSchema('sv');
export default sliderSchema;
