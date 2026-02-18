/**
 * Swedish translations for BulkActionBar component
 */

export const bulkActionBarTranslations_sv = {
  displayName: 'Massåtgärdsfält',
  description: 'Verktygsrad som visas när flera objekt är valda i en tabell eller lista',
  
  props: {
    selectedCount: {
      displayName: 'Antal valda',
      description: 'Antal valda objekt',
    },
    totalCount: {
      displayName: 'Totalt antal',
      description: 'Totalt antal objekt som kan väljas',
    },
    selectAll: {
      displayName: 'Alla valda',
      description: 'Om alla objekt är valda',
    },
    onSelectAll: {
      displayName: 'Välj alla-callback',
      description: 'Funktion som anropas när "välj alla" klickas',
    },
    onClearSelection: {
      displayName: 'Rensa val-callback',
      description: 'Funktion som anropas när valet ska rensas',
    },
    actions: {
      displayName: 'Åtgärdsknappar',
      description: 'Åtgärdsknappar att visa i fältet',
    },
    position: {
      displayName: 'Position',
      description: 'Var fältet ska positioneras',
      valueLabels: {
        top: 'Topp',
        bottom: 'Botten',
        sticky: 'Klistrad',
      },
    },
    showSelectAllPrompt: {
      displayName: 'Visa välj alla-prompt',
      description: 'Visa "Välj alla X objekt"-prompt',
    },
    selectAllText: {
      displayName: 'Välj alla-text',
      description: 'Anpassad text för "välj alla"-länk',
    },
  },
};
