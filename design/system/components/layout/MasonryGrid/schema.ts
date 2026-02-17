/**
 * MasonryGrid Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { masonryGridTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createMasonryGridSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(masonryGridTranslations, locale);
  
  return {
    $id: 'masonryGrid',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'RectangleStack',
    tags: ['masonry', 'grid', 'layout', 'columns'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      gap: 'lg',
    },
    
    props: {
      gap: createLocalizedProp(
        {
          name: 'gap',
          type: 'enum',
          required: false,
          default: 'lg',
          editorType: 'select',
          values: ['xs', 'sm', 'md', 'lg', 'xl'] as const,
          group: 'layout',
        },
        t.props?.gap
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['grid', 'bentoGrid'],
    docsUrl: '/docs/components/masonry-grid',
  };
};

export const masonryGridSchema = createMasonryGridSchema('sv');
export default masonryGridSchema;
