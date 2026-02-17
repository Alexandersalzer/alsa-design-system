/**
 * Kbd Component Schema
 * 
 * Display keyboard shortcuts
 * Used for documentation and UI hints
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { kbdTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createKbdSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(kbdTranslations, locale);
  
  return {
    $id: 'kbd',
    displayName: t.displayName,
    category: 'actions',
    description: t.description,
    icon: 'CommandLine',
    tags: ['keyboard', 'shortcut', 'key', 'hint'],
    version: '1.0.0',
    cmsEnabled: false, // Display-only component for keyboard hints
    
    defaultProps: {
      variant: 'secondary',
    },
    
    props: {
      keys: createLocalizedProp(
        {
          name: 'keys',
          type: 'array',
          required: false,
          editorType: 'builder',
          group: 'content',
        },
        t.props?.keys
      ),
      
      variant: createLocalizedProp(
        {
          name: 'variant',
          type: 'enum',
          required: false,
          default: 'secondary',
          editorType: 'segmented',
          values: ['secondary', 'ghost', 'primary'] as const,
          group: 'appearance',
        },
        t.props?.variant
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['button', 'tooltip'],
    docsUrl: '/docs/components/kbd',
  };
};

export const kbdSchema = createKbdSchema('sv');
export default kbdSchema;
