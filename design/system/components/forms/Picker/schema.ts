/**
 * Picker Component Schema
 * 
 * Dropdown menu for selecting options
 * Form control component
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { pickerTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createPickerSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(pickerTranslations, locale);
  
  return {
    $id: 'picker',
    displayName: t.displayName,
    category: 'forms',
    description: t.description,
    icon: 'ChevronDown',
    tags: ['picker', 'select', 'dropdown', 'form'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      variant: 'default',
      size: 'md',
      radius: 'md',
      multiple: false,
      searchable: false,
      disabled: false,
      required: false,
      loading: false,
    },
    
    props: {
      label: createLocalizedProp(
        {
          name: 'label',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 50,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.label
      ),
      
      placeholder: createLocalizedProp(
        {
          name: 'placeholder',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 100,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.placeholder
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
      
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'default',
          editorType: 'select',
          values: ['default', 'compact', 'full-width', 'colorful', 'minimal'] as const,
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
          values: ['sm', 'md', 'lg'] as const,
          group: 'appearance',
        },
        t.props?.size
      ),
      
      radius: createLocalizedProp(
        {
          name: 'radius',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['sm', 'md', 'lg'] as const,
          group: 'appearance',
        },
        t.props?.radius
      ),
      
      multiple: createLocalizedProp(
        {
          name: 'multiple',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.multiple
      ),
      
      searchable: createLocalizedProp(
        {
          name: 'searchable',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.searchable
      ),
      
      searchPlaceholder: createLocalizedProp(
        {
          name: 'searchPlaceholder',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 50,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.searchPlaceholder
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
      
      loading: createLocalizedProp(
        {
          name: 'loading',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
        },
        t.props?.loading
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['input', 'listbox', 'popover'],
    docsUrl: '/docs/components/picker',
  };
};

export const pickerSchema = createPickerSchema('sv');
export default pickerSchema;
