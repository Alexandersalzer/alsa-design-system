/**
 * BentoGrid Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { bentoGridTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createBentoGridSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(bentoGridTranslations, locale);
  
  return {
    $id: 'bentoGrid',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'Squares2X2',
    tags: ['bento', 'grid', 'layout', 'complex'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      columns: 3,
      gap: 'lg',
      alignItems: 'stretch',
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
      
      gap: createLocalizedProp(
        {
          name: 'gap',
          type: 'enum',
          required: false,
          default: 'lg',
          editorType: 'select',
          values: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const,
          group: 'layout',
        },
        t.props?.gap
      ),
      
      alignItems: createLocalizedProp(
        {
          name: 'alignItems',
          type: 'enum',
          required: false,
          default: 'stretch',
          editorType: 'select',
          values: ['start', 'center', 'end', 'stretch'] as const,
          group: 'layout',
        },
        t.props?.alignItems
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['grid', 'masonryGrid'],
    docsUrl: '/docs/components/bento-grid',
  };
};

export const bentoGridSchema = createBentoGridSchema('sv');
export default bentoGridSchema;
