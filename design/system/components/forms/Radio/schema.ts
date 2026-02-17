/**
 * Radio Component Schema
 * 
 * Radio button for single selections
 * Form control component
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { radioTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createRadioSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(radioTranslations, locale);
  
  return {
    $id: 'radio',
    displayName: t.displayName,
    category: 'forms',
    description: t.description,
    icon: 'Circle',
    tags: ['radio', 'form', 'selection', 'option'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      size: 'md',
      checked: false,
      disabled: false,
      required: false,
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
      
      description: createLocalizedProp(
        {
          name: 'description',
          type: 'string',
          required: false,
          editorType: 'textarea',
          maxLength: 200,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.description
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
      
      checked: createLocalizedProp(
        {
          name: 'checked',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
        },
        t.props?.checked
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
      
      required: createLocalizedProp(
        {
          name: 'required',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'validation',
        },
        t.props?.required
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['checkbox', 'selectionCard', 'radioGroup'],
    docsUrl: '/docs/components/radio',
  };
};

export const radioSchema = createRadioSchema('sv');
export default radioSchema;
