/**
 * Swedish translations for Input component
 */

export const inputTranslations_sv = {
  displayName: 'Textfält',
  description: 'Textinmatningsfält med stöd för olika varianter, ikoner och validering',
  
  props: {
    label: {
      displayName: 'Etikett',
      description: 'Etiketttext för fältet',
    },
    placeholder: {
      displayName: 'Platshållare',
      description: 'Platshållartext när fältet är tomt',
    },
    type: {
      displayName: 'Typ',
      description: 'Typ av inmatning',
      valueLabels: {
        text: 'Text',
        email: 'E-post',
        password: 'Lösenord',
        number: 'Nummer',
        tel: 'Telefon',
        url: 'URL',
        search: 'Sök',
      },
    },
    variant: {
      displayName: 'Variant',
      description: 'Visuell stilvariant',
      valueLabels: {
        flat: 'Flat',
        bordered: 'Kantad',
        faded: 'Tonad',
        underlined: 'Understruken',
        page: 'Sida',
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
    radius: {
      displayName: 'Radie',
      description: 'Hörnradie',
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
    labelPlacement: {
      displayName: 'Etikettplacering',
      description: 'Var etiketten placeras',
      valueLabels: {
        outside: 'Utanför',
        'outside-left': 'Utanför vänster',
      },
    },
    error: {
      displayName: 'Felmeddelande',
      description: 'Felmeddelande att visa',
    },
    helper: {
      displayName: 'Hjälptext',
      description: 'Hjälptext under fältet',
    },
    description: {
      displayName: 'Beskrivning',
      description: 'Beskrivande text',
    },
    showPasswordToggle: {
      displayName: 'Visa lösenordsväxlare',
      description: 'Visa knapp för att visa/dölja lösenord',
    },
    isClearable: {
      displayName: 'Rensbar',
      description: 'Visa knapp för att rensa fältet',
    },
    isInvalid: {
      displayName: 'Ogiltig',
      description: 'Markera fältet som ogiltigt',
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
