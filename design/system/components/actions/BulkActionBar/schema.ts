/**
 * BulkActionBar Component Schema
 * 
 * Toolbar for bulk actions on selected items
 * Used internally in table/list interfaces
 */

import { ComponentSchema } from '../../../core/schemas/component.types';
import { getTranslation, createLocalizedProp } from '../../../core/schemas/i18n';
import { bulkActionBarTranslations } from './i18n';
import type { SupportedLocale } from '../../../core/schemas/i18n/types';

export const createBulkActionBarSchema = (locale: SupportedLocale = 'sv'): ComponentSchema => {
  const t = getTranslation(bulkActionBarTranslations, locale);
  
  return {
    $id: 'bulkActionBar',
    displayName: t.displayName,
    category: 'actions',
    description: t.description,
    icon: 'CheckCircle',
    tags: ['bulk', 'actions', 'toolbar', 'selection', 'table'],
    version: '1.0.0',
    cmsEnabled: false, // Internal UI component for data tables
    
    defaultProps: {
      selectedCount: 0,
      position: 'sticky',
      showSelectAllPrompt: true,
      selectAll: false,
    },
    
    props: {
      selectedCount: createLocalizedProp(
        {
          name: 'selectedCount',
          type: 'string',
          required: true,
          default: '0',
          editorType: 'text',
          group: 'state',
        },
        t.props?.selectedCount
      ),
      
      totalCount: createLocalizedProp(
        {
          name: 'totalCount',
          type: 'string',
          required: false,
          editorType: 'text',
          group: 'state',
        },
        t.props?.totalCount
      ),
      
      selectAll: createLocalizedProp(
        {
          name: 'selectAll',
          type: 'boolean',
          required: false,
          default: false,
          editorType: 'toggle',
          group: 'state',
        },
        t.props?.selectAll
      ),
      
      position: createLocalizedProp(
        {
          name: 'position',
          type: 'enum',
          required: false,
          default: 'sticky',
          editorType: 'segmented',
          values: ['top', 'bottom', 'sticky'] as const,
          group: 'layout',
        },
        t.props?.position
      ),
      
      showSelectAllPrompt: createLocalizedProp(
        {
          name: 'showSelectAllPrompt',
          type: 'boolean',
          required: false,
          default: true,
          editorType: 'toggle',
          group: 'behavior',
        },
        t.props?.showSelectAllPrompt
      ),
      
      selectAllText: createLocalizedProp(
        {
          name: 'selectAllText',
          type: 'string',
          required: false,
          editorType: 'text',
          maxLength: 50,
          group: 'content',
        },
        t.props?.selectAllText
      ),
    },
    
    validation: [],
    examples: [],
    
    related: ['checkbox', 'button', 'table'],
    docsUrl: '/docs/components/bulk-action-bar',
  };
};

export const bulkActionBarSchema = createBulkActionBarSchema('sv');
export default bulkActionBarSchema;
