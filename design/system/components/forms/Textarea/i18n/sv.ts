/**
 * Swedish translations for Textarea component
 */

export const textareaTranslations_sv = {
  displayName: 'Textområde',
  description: 'Flerradigt textfält för längre innehåll',
  
  props: {
    label: {
      displayName: 'Etikett',
      description: 'Etiketttext för fältet',
    },
    placeholder: {
      displayName: 'Platshållare',
      description: 'Platshållartext när fältet är tomt',
    },
    description: {
      displayName: 'Beskrivning',
      description: 'Hjälptext under etiketten',
    },
    error: {
      displayName: 'Felmeddelande',
      description: 'Felmeddelande att visa',
    },
    success: {
      displayName: 'Framgångsmeddelande',
      description: 'Framgångsmeddelande att visa',
    },
    variant: {
      displayName: 'Variant',
      description: 'Visuell stilvariant',
      valueLabels: {
        flat: 'Flat',
        bordered: 'Kantad',
        faded: 'Tonad',
        underlined: 'Understruken',
      },
    },
    size: {
      displayName: 'Storlek',
      description: 'Fältstorlek',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
      },
    },
    color: {
      displayName: 'Färg',
      description: 'Färgvariant',
      valueLabels: {
        default: 'Standard',
        primary: 'Primär',
        secondary: 'Sekundär',
        success: 'Framgång',
        warning: 'Varning',
        danger: 'Fara',
      },
    },
    resize: {
      displayName: 'Storleksändring',
      description: 'Hur användaren kan ändra storlek',
      valueLabels: {
        none: 'Ingen',
        vertical: 'Vertikal',
        horizontal: 'Horisontell',
        both: 'Både och',
      },
    },
    showCharacterCount: {
      displayName: 'Visa teckenräknare',
      description: 'Visa antal tecken som skrivits',
    },
    autoResize: {
      displayName: 'Automatisk storleksändring',
      description: 'Ändra höjd baserat på innehåll',
    },
    isClearable: {
      displayName: 'Rensbar',
      description: 'Visa knapp för att rensa fältet',
    },
    fullWidth: {
      displayName: 'Full bredd',
      description: 'Ta hela tillgänglig bredd',
    },
    disabled: {
      displayName: 'Inaktiverad',
      description: 'Inaktivera fältet',
    },
    required: {
      displayName: 'Obligatorisk',
      description: 'Markera fältet som obligatoriskt',
    },
  },
};
