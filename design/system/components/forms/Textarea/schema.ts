/**
 * Textarea Component Schema
 * 
 * Multi-line text input field
 * Form control component
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { textareaTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createTextareaSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(textareaTranslations, locale);
  
  return {
    $id: 'textarea',
    displayName: t.displayName,
    category: 'forms',
    description: t.description,
    icon: 'DocumentText',
    tags: ['textarea', 'form', 'text', 'multiline'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      variant: 'flat',
      color: 'default',
      size: 'md',
      resize: 'vertical',
      showCharacterCount: false,
      autoResize: false,
      isClearable: false,
      fullWidth: false,
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
          default: 'flat',
          editorType: 'segmented',
          values: ['flat', 'bordered', 'faded', 'underlined'] as const,
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
      
      color: createLocalizedProp(
        {
          name: 'color',
          type: 'enum',
          required: false,
          default: 'default',
          editorType: 'select',
          values: ['default', 'primary', 'secondary', 'success', 'warning', 'danger'] as const,
          group: 'appearance',
        },
        t.props?.color
      ),
      
      resize: createLocalizedProp(
        {
          name: 'resize',
          type: 'enum',
          required: false,
          default: 'vertical',
          editorType: 'segmented',
          values: ['none', 'vertical', 'horizontal', 'both'] as const,
          group: 'behavior',
        },
        t.props?.resize
      ),
      
      showCharacterCount: createLocalizedProp(
        {
          name: 'showCharacterCount',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.showCharacterCount
      ),
      
      autoResize: createLocalizedProp(
        {
          name: 'autoResize',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.autoResize
      ),
      
      isClearable: createLocalizedProp(
        {
          name: 'isClearable',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.isClearable
      ),
      
      fullWidth: createLocalizedProp(
        {
          name: 'fullWidth',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'layout',
        },
        t.props?.fullWidth
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
    
    related: ['input', 'picker'],
    docsUrl: '/docs/components/textarea',
  };
};

export const textareaSchema = createTextareaSchema('sv');
export default textareaSchema;
