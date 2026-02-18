/**
 * Divider Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { dividerTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createDividerSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(dividerTranslations, locale);
  
  return {
    $id: 'divider',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'MinusSmall',
    tags: ['divider', 'separator', 'layout', 'hr'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      orientation: 'horizontal',
      weight: 'default',
      spacing: 'md',
    },
    
    props: {
      orientation: createLocalizedProp(
        {
          name: 'orientation',
          type: 'enum',
          required: false,
          default: 'horizontal',
          editorType: 'segmented',
          values: ['horizontal', 'vertical'] as const,
          group: 'layout',
        },
        t.props?.orientation
      ),
      
      weight: createLocalizedProp(
        {
          name: 'weight',
          type: 'enum',
          required: false,
          default: 'default',
          editorType: 'select',
          values: ['default', 'strong', 'emphasis', 'inverse'] as const,
          group: 'appearance',
        },
        t.props?.weight
      ),
      
      spacing: createLocalizedProp(
        {
          name: 'spacing',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['sm', 'md', 'lg'] as const,
          group: 'layout',
        },
        t.props?.spacing
      ),
      
      label: createLocalizedProp(
        {
          name: 'label',
          type: 'string',
          required: false,
          editorType: 'input',
          group: 'content',
        },
        t.props?.label
      ),
      
      labelPosition: createLocalizedProp(
        {
          name: 'labelPosition',
          type: 'enum',
          required: false,
          default: 'center',
          editorType: 'segmented',
          values: ['left', 'center', 'right'] as const,
          group: 'layout',
        },
        t.props?.labelPosition
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['spacer', 'vStack'],
    docsUrl: '/docs/components/divider',
  };
};

export const dividerSchema = createDividerSchema('sv');
export default dividerSchema;
