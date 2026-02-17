/**
 * Bleed Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { bleedTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createBleedSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(bleedTranslations, locale);
  
  return {
    $id: 'bleed',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'ArrowsPointingOut',
    tags: ['bleed', 'overflow', 'layout', 'margin'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      disableOnMobile: false,
    },
    
    props: {
      amount: createLocalizedProp(
        {
          name: 'amount',
          type: 'string',
          required: false,
          editorType: 'input',
          group: 'layout',
        },
        t.props?.amount
      ),
      
      horizontal: createLocalizedProp(
        {
          name: 'horizontal',
          type: 'string',
          required: false,
          editorType: 'input',
          group: 'layout',
        },
        t.props?.horizontal
      ),
      
      vertical: createLocalizedProp(
        {
          name: 'vertical',
          type: 'string',
          required: false,
          editorType: 'input',
          group: 'layout',
        },
        t.props?.vertical
      ),
      
      disableOnMobile: createLocalizedProp(
        {
          name: 'disableOnMobile',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.disableOnMobile
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['box', 'card'],
    docsUrl: '/docs/components/bleed',
  };
};

export const bleedSchema = createBleedSchema('sv');
export default bleedSchema;
