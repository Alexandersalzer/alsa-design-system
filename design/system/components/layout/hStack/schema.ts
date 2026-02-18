/**
 * HStack Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { hStackTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createHStackSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(hStackTranslations, locale);
  
  return {
    $id: 'hStack',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'Bars3BottomLeft',
    tags: ['stack', 'layout', 'horizontal', 'flex'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      spacing: 'md',
      align: 'center',
      justify: 'start',
      wrap: false,
    },
    
    props: {
      spacing: createLocalizedProp(
        {
          name: 'spacing',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'segmented',
          values: ['xs', 'sm', 'md', 'lg', 'xl'] as const,
          group: 'layout',
        },
        t.props?.spacing
      ),
      
      align: createLocalizedProp(
        {
          name: 'align',
          type: 'enum',
          required: false,
          default: 'center',
          editorType: 'select',
          values: ['start', 'center', 'end', 'baseline', 'stretch'] as const,
          group: 'layout',
        },
        t.props?.align
      ),
      
      justify: createLocalizedProp(
        {
          name: 'justify',
          type: 'enum',
          required: false,
          default: 'start',
          editorType: 'select',
          values: ['start', 'center', 'end', 'between', 'around', 'evenly'] as const,
          group: 'layout',
        },
        t.props?.justify
      ),
      
      wrap: createLocalizedProp(
        {
          name: 'wrap',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.wrap
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['vStack', 'grid', 'card'],
    docsUrl: '/docs/components/hstack',
  };
};

export const hStackSchema = createHStackSchema('sv');
export default hStackSchema;
