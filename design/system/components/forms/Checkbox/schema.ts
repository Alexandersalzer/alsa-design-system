/**
 * Checkbox Component Schema
 * 
 * Checkbox for boolean selections
 * Form control component
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { checkboxTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createCheckboxSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(checkboxTranslations, locale);
  
  return {
    $id: 'checkbox',
    displayName: t.displayName,
    category: 'forms',
    description: t.description,
    icon: 'CheckSquare',
    tags: ['checkbox', 'form', 'toggle', 'selection'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      size: 'md',
      indeterminate: false,
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
      
      error: createLocalizedProp(
        {
          name: 'error',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 100,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.error
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
      
      indeterminate: createLocalizedProp(
        {
          name: 'indeterminate',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
        },
        t.props?.indeterminate
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
    
    related: ['radio', 'switch', 'selectionCard'],
    docsUrl: '/docs/components/checkbox',
  };
};

export const checkboxSchema = createCheckboxSchema('sv');
export default checkboxSchema;
