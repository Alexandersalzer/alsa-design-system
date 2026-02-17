/**
 * SegmentedControl Component Schema
 * 
 * Used internally as a form control
 * Not typically exposed to CMS
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { segmentedControlTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createSegmentedControlSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(segmentedControlTranslations, locale);
  
  return {
    $id: 'segmentedControl',
    displayName: t.displayName,
    category: 'actions',
    description: t.description,
    icon: 'Squares2X2',
    tags: ['control', 'selector', 'tabs', 'toggle', 'form'],
    version: '1.0.0',
    cmsEnabled: false, // Form control, not for CMS
    
    defaultProps: {
      variant: 'default',
      size: 'md',
      fullWidth: false,
      disabled: false,
      iconOnly: false,
    },
    
    props: {
      options: createLocalizedProp(
        {
          name: 'options',
          type: 'array',
          required: true,
          editorType: 'list',
          items: {
            name: 'option',
            type: 'object',
            displayName: 'Option',
            properties: {
              value: {
                name: 'value',
                type: 'string',
                displayName: 'Value',
                required: true,
              },
              label: {
                name: 'label',
                type: 'string',
                displayName: 'Label',
                required: true,
              },
            },
          },
          group: 'content',
        },
        t.props?.options
      ),
      
      value: createLocalizedProp(
        {
          name: 'value',
          type: 'string',
          required: true,
          editorType: 'text',
          group: 'state',
        },
        t.props?.value
      ),
      
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'default',
          editorType: 'select',
          values: ['default', 'raised', 'accent', 'pill', 'ghost'] as const,
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
      
      iconOnly: createLocalizedProp(
        {
          name: 'iconOnly',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'appearance',
        },
        t.props?.iconOnly
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
    
    related: ['picker', 'radio'],
    docsUrl: '/docs/components/segmented-control',
  };
};

export const segmentedControlSchema = createSegmentedControlSchema('sv');
export default segmentedControlSchema;
