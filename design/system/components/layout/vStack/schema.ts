/**
 * VStack Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { vStackTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createVStackSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(vStackTranslations, locale);
  
  return {
    $id: 'vStack',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'Bars3',
    tags: ['stack', 'layout', 'vertical', 'flex'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      spacing: 'md',
      align: 'stretch',
      fullWidth: false,
    },
    
    props: {
      spacing: createLocalizedProp(
        {
          name: 'spacing',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'select',
          values: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const,
          group: 'layout',
        },
        t.props?.spacing
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
      
      justify: createLocalizedProp(
        {
          name: 'justify',
          type: 'enum',
          required: false,
          editorType: 'select',
          values: ['start', 'center', 'end', 'between', 'around', 'evenly'] as const,
          group: 'layout',
        },
        t.props?.justify
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
    },
    
    validation: [],
    examples: [],
    
    related: ['hStack', 'grid', 'card'],
    docsUrl: '/docs/components/vstack',
  };
};

export const vStackSchema = createVStackSchema('sv');
export default vStackSchema;
