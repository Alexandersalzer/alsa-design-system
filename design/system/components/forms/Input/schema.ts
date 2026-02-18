/**
 * Input Component Schema
 * 
 * Text input field with extensive customization options
 * Form control component - not directly CMS-editable
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { inputTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createInputSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(inputTranslations, locale);
  
  return {
    $id: 'input',
    displayName: t.displayName,
    category: 'forms',
    description: t.description,
    icon: 'Pencil',
    tags: ['input', 'form', 'text', 'field'],
    version: '1.0.0',
    cmsEnabled: false, // Form control component
    
    defaultProps: {
      variant: 'flat',
      color: 'default',
      size: 'md',
      radius: 'md',
      labelPlacement: 'outside',
      type: 'text',
      showPasswordToggle: true,
      isClearable: false,
      isInvalid: false,
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
      
      type: createLocalizedProp(
        {
          name: 'type',
          type: 'enum',
          required: false,
          default: 'text',
          editorType: 'select',
          values: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'] as const,
          group: 'behavior',
        },
        t.props?.type
      ),
      
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'flat',
          editorType: 'segmented',
          values: ['flat', 'bordered', 'faded', 'underlined', 'page'] as const,
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
      
      labelPlacement: createLocalizedProp(
        {
          name: 'labelPlacement',
          type: 'enum',
          required: false,
          default: 'outside',
          editorType: 'segmented',
          values: ['outside', 'outside-left'] as const,
          group: 'layout',
        },
        t.props?.labelPlacement
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
      
      helper: createLocalizedProp(
        {
          name: 'helper',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 150,
          cmsEnabled: true,
          group: 'content',
        },
        t.props?.helper
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
      
      showPasswordToggle: createLocalizedProp(
        {
          name: 'showPasswordToggle',
          type: 'boolean',
          required: false,
          default: true,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.showPasswordToggle
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
      
      isInvalid: createLocalizedProp(
        {
          name: 'isInvalid',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
        },
        t.props?.isInvalid
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
    
    related: ['textarea', 'picker', 'button'],
    docsUrl: '/docs/components/input',
  };
};

export const inputSchema = createInputSchema('sv');
export default inputSchema;
