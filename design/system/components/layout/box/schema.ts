/**
 * Box Component Schema
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { boxTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createBoxSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(boxTranslations, locale);
  
  return {
    $id: 'box',
    displayName: t.displayName,
    category: 'layout',
    description: t.description,
    icon: 'Square3Stack3D',
    tags: ['box', 'layout', 'container', 'primitive'],
    version: '1.0.0',
    cmsEnabled: false,
    
    defaultProps: {
      padding: 'md',
      radius: 'md',
      bg: 'transparent',
      border: 'none',
    },
    
    props: {
      padding: createLocalizedProp(
        {
          name: 'padding',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'select',
          values: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const,
          group: 'layout',
        },
        t.props?.padding
      ),
      
      radius: createLocalizedProp(
        {
          name: 'radius',
          type: 'enum',
          required: false,
          default: 'md',
          editorType: 'select',
          values: ['none', 'sm', 'md', 'lg', 'xl', 'full'] as const,
          group: 'appearance',
        },
        t.props?.radius
      ),
      
      bg: createLocalizedProp(
        {
          name: 'bg',
          type: 'enum',
          required: false,
          default: 'transparent',
          editorType: 'select',
          values: ['base', 'card', 'hover', 'sidebar', 'nav', 'transparent'] as const,
          group: 'appearance',
        },
        t.props?.bg
      ),
      
      border: createLocalizedProp(
        {
          name: 'border',
          type: 'enum',
          required: false,
          default: 'none',
          editorType: 'select',
          values: ['none', 'light', 'default', 'heavy'] as const,
          group: 'appearance',
        },
        t.props?.border
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['card', 'vStack', 'hStack'],
    docsUrl: '/docs/components/box',
  };
};

export const boxSchema = createBoxSchema('sv');
export default boxSchema;
