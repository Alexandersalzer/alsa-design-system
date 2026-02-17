/**
 * English translations for BulkActionBar component
 */

export const bulkActionBarTranslations_en = {
  displayName: 'Bulk Action Bar',
  description: 'Toolbar that appears when multiple items are selected in a table or list',
  
  props: {
    selectedCount: {
      displayName: 'Selected Count',
      description: 'Number of selected items',
    },
    totalCount: {
      displayName: 'Total Count',
      description: 'Total number of items that can be selected',
    },
    selectAll: {
      displayName: 'Select All',
      description: 'Whether all items are selected',
    },
    onSelectAll: {
      displayName: 'Select All Callback',
      description: 'Function called when "select all" is clicked',
    },
    onClearSelection: {
      displayName: 'Clear Selection Callback',
      description: 'Function called when selection should be cleared',
    },
    actions: {
      displayName: 'Action Buttons',
      description: 'Action buttons to show in the bar',
    },
    position: {
      displayName: 'Position',
      description: 'Where the bar should be positioned',
      valueLabels: {
        top: 'Top',
        bottom: 'Bottom',
        sticky: 'Sticky',
      },
    },
    showSelectAllPrompt: {
      displayName: 'Show Select All Prompt',
      description: 'Show "Select all X items" prompt',
    },
    selectAllText: {
      displayName: 'Select All Text',
      description: 'Custom text for "select all" link',
    },
  },
};
