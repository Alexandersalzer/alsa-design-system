/**
 * Switch Component Schema
 * 
 * Toggle switch for boolean options
 * Form control component
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { switchTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createSwitchSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(switchTranslations, locale);
  
  return {
    $id: 'switch',
    displayName: t.displayName,
    category: 'forms',
    description: t.description,
    icon: 'AdjustmentsHorizontal',
    tags: ['switch', 'toggle', 'form', 'boolean'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      size: 'md',
      labelPosition: 'right',
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
      
      success: createLocalizedProp(
        {
          name: 'success',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 100,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.success
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
      
      labelPosition: createLocalizedProp(
        {
          name: 'labelPosition',
          type: 'enum',
          required: false,
          default: 'right',
          editorType: 'segmented',
          values: ['left', 'right'] as const,
          group: 'layout',
        },
        t.props?.labelPosition
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
    
    related: ['checkbox', 'radio'],
    docsUrl: '/docs/components/switch',
  };
};

export const switchSchema = createSwitchSchema('sv');
export default switchSchema;
