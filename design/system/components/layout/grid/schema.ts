/**
 * Grid Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { gridTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createGridSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(gridTranslations, locale);
  
  return {
    $id: 'grid',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'Squares2X2',
    tags: ['grid', 'layout', 'responsive', 'columns'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      columns: 3,
      spacing: 'md',
    },
    
    props: {
      columns: createLocalizedProp(
        {
          name: 'columns',
          type: 'number',
          required: false,
          default: 3,
          editorType: 'stepper',
          min: 1,
          max: 12,
          group: 'layout',
        },
        t.props?.columns
      ),
      
      spacing: createLocalizedProp(
        {
          name: 'spacing',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['none', 'xs', 'sm', 'md', 'lg', 'xl'] as const,
          group: 'layout',
        },
        t.props?.spacing
      ),
      
      cardDensity: createLocalizedProp(
        {
          name: 'cardDensity',
          type: 'enum',
          required: false,
          editorType: 'segmented',
          values: ['compact', 'standard', 'spacious'] as const,
          group: 'layout',
        },
        t.props?.cardDensity
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['hStack', 'vStack', 'card'],
    docsUrl: '/docs/components/grid',
  };
};

export const gridSchema = createGridSchema('sv');
export default gridSchema;
