/**
 * Swedish translations for Button component
 */

import type { ComponentTranslation } from '../../../../core/schemas/i18n/types';

export const sv: ComponentTranslation = {
  displayName: 'Knapp',
  description: 'Interaktiv knappkomponent med flera varianter, storlekar och åtgärdsstöd',
  defaultContent: 'Klicka här',
  
  props: {
    content: {
      displayName: 'Knapptext',
      description: 'Text som visas på knappen',
      placeholder: 'Ange knapptext...',
      examples: ['Läs mer', 'Kom igång', 'Kontakta oss', 'Boka samtal'],
    },
    
    variant: {
      displayName: 'Variant',
      description: 'Visuell stil för knappen',
      valueLabels: {
        brand: 'Varumärke',
        primary: 'Primär',
        secondary: 'Sekundär',
        accent: 'Accent',
        ghost: 'Genomskinlig',
        destructive: 'Destruktiv',
      },
    },
    
    size: {
      displayName: 'Storlek',
      description: 'Knappstorlek',
      valueLabels: {
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
        xl: 'Extra stor',
      },
    },
    
    radius: {
      displayName: 'Hörnradie',
      description: 'Avrundning av knappens hörn',
      valueLabels: {
        none: 'Ingen',
        xs: 'Extra liten',
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
        xl: 'Extra stor',
        full: 'Full (Piller)',
      },
    },
    
    fullWidth: {
      displayName: 'Full bredd',
      description: 'Gör knappen fullbredd i sin behållare',
      trueLabel: 'Full bredd',
      falseLabel: 'Auto bredd',
    },
    
    loading: {
      displayName: 'Laddningstillstånd',
      description: 'Visa laddningssnurra',
      editorHint: 'Styrs vanligtvis programmatiskt',
    },
    
    disabled: {
      displayName: 'Inaktiverad',
      description: 'Inaktivera knappinteraktion',
    },
    
    href: {
      displayName: 'Länk-URL',
      description: 'URL att navigera till (renderas som länk istället för knapp)',
      placeholder: 'https://example.com eller /om-oss',
      editorHint: 'Lämna tom för att använda action-konfiguration istället',
    },
    
    target: {
      displayName: 'Länkmål',
      description: 'Hur länken ska öppnas',
      valueLabels: {
        _self: 'Samma flik',
        _blank: 'Ny flik',
      },
    },
    
    action: {
      displayName: 'Länk till',
      description: 'Definiera vad som händer när knappen klickas',
      editorHint: 'Konfigurera navigering, bokning, formulärinlämning, etc.',
    },
  },
  
  validation: {
    'content-not-empty': 'Knapptext får inte vara tom',
    'content-length': 'Knapptext bör vara koncis (max 50 tecken rekommenderat)',
    'href-or-action': 'Använd antingen href eller action, inte båda',
  },
  
  examples: {
    'primary-cta': {
      name: 'Primär CTA',
      description: 'Standard call-to-action knapp',
      category: 'vanliga',
    },
    'navigation': {
      name: 'Navigeringsknapp',
      description: 'Knapp som navigerar till en annan sida',
      category: 'navigering',
    },
    'booking': {
      name: 'Bokningsknapp',
      description: 'Öppnar bokningsmodal (Calendly/Cal.com)',
      category: 'bokning',
    },
    'ghost': {
      name: 'Genomskinlig knapp',
      description: 'Subtil sekundär åtgärd',
      category: 'vanliga',
    },
  },
};
