/**
 * Rhythm Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { rhythmTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createRhythmSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(rhythmTranslations, locale);
  
  return {
    $id: 'rhythm',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'ViewColumns',
    tags: ['rhythm', 'baseline', 'grid', 'layout'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      unit: 'md',
      align: 'stretch',
      direction: 'column',
    },
    
    props: {
      unit: createLocalizedProp(
        {
          name: 'unit',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'select',
          values: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const,
          group: 'layout',
        },
        t.props?.unit
      ),
      
      align: createLocalizedProp(
        {
          name: 'align',
          type: 'enum',
          required: false,
          default: 'stretch',
          editorType: 'select',
          values: ['start', 'center', 'end', 'stretch'] as const,
          group: 'layout',
        },
        t.props?.align
      ),
      
      direction: createLocalizedProp(
        {
          name: 'direction',
          type: 'enum',
          required: false,
          default: 'column',
          editorType: 'segmented',
          values: ['column', 'row'] as const,
          group: 'layout',
        },
        t.props?.direction
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['vStack', 'grid'],
    docsUrl: '/docs/components/rhythm',
  };
};

export const rhythmSchema = createRhythmSchema('sv');
export default rhythmSchema;
