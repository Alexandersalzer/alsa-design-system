/**
 * Spacer Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { spacerTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createSpacerSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(spacerTranslations, locale);
  
  return {
    $id: 'spacer',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'ArrowsUpDown',
    tags: ['spacer', 'spacing', 'layout', 'vertical'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      desktop: 1.5,
      mobile: 2.5,
    },
    
    props: {
      desktop: createLocalizedProp(
        {
          name: 'desktop',
          type: 'number',
          required: false,
          default: 1.5,
          editorType: 'slider',
          min: 0.5,
          max: 3,
          step: 0.25,
          group: 'layout',
        },
        t.props?.desktop
      ),
      
      mobile: createLocalizedProp(
        {
          name: 'mobile',
          type: 'number',
          required: false,
          default: 2.5,
          editorType: 'slider',
          min: 0.5,
          max: 3,
          step: 0.25,
          group: 'layout',
        },
        t.props?.mobile
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['vStack', 'hStack'],
    docsUrl: '/docs/components/spacer',
  };
};

export const spacerSchema = createSpacerSchema('sv');
export default spacerSchema;
