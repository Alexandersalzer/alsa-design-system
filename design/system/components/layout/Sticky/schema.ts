/**
 * Sticky Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { stickyTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createStickySchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(stickyTranslations, locale);
  
  return {
    $id: 'sticky',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'ArrowUpCircle',
    tags: ['sticky', 'position', 'layout', 'fixed'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      top: '100px',
      zIndex: 10,
    },
    
    props: {
      top: createLocalizedProp(
        {
          name: 'top',
          type: 'string',
          required: false,
          default: '100px',
          editorType: 'input',
          group: 'layout',
        },
        t.props?.top
      ),
      
      zIndex: createLocalizedProp(
        {
          name: 'zIndex',
          type: 'number',
          required: false,
          default: 10,
          editorType: 'stepper',
          min: 0,
          max: 100,
          group: 'layout',
        },
        t.props?.zIndex
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['box'],
    docsUrl: '/docs/components/sticky',
  };
};

export const stickySchema = createStickySchema('sv');
export default stickySchema;
