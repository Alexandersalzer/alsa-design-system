/**
 * Swedish translations for Avatar component
 */

import type { ComponentTranslation } from '../../../../core/schemas/i18n/types';

export const sv: ComponentTranslation = {
  displayName: 'Avatar',
  description: 'Profilbildskomponent med fallback-initialer, badge-overlay och flera storleksalternativ',

  props: {
    src: {
      displayName: 'Bild-URL',
      description: 'URL till profilbilden',
      placeholder: 'https://example.com/foto.jpg',
      editorHint: 'Lämna tom för att visa initialer eller ikon som fallback',
    },

    alt: {
      displayName: 'Alt-text',
      description: 'Tillgänglig beskrivning av bilden',
      placeholder: 'Användarens namn eller beskrivning',
    },

    name: {
      displayName: 'Namn',
      description: 'Används för att generera initialer när ingen bild finns',
      placeholder: 'Alexander Salzer',
    },

    size: {
      displayName: 'Storlek',
      description: 'Avatarens dimensioner',
      valueLabels: {
        '2xs': 'Extra extra liten (24px)',
        xs: 'Extra liten (32px)',
        sm: 'Liten (40px)',
        md: 'Medium (48px)',
        lg: 'Stor (56px)',
        xl: 'Extra stor (64px)',
        '2xl': '2X stor (80px)',
        '3xl': '3X stor (112px)',
        '4xl': '4X stor (140px)',
        full: 'Full (100%)',
      },
    },

    shape: {
      displayName: 'Form',
      description: 'Kantradien på avataren',
      valueLabels: {
        full: 'Cirkel',
        rounded: 'Avrundad',
        square: 'Kvadrat',
      },
    },

    variant: {
      displayName: 'Variant',
      description: 'Bakgrundsstil när fallback visas',
      valueLabels: {
        solid: 'Solid',
        subtle: 'Subtil',
        outline: 'Kontur',
      },
    },

    colorPalette: {
      displayName: 'Färg',
      description: 'Färgpalett för fallback-bakgrunden',
      valueLabels: {
        gray: 'Grå',
        red: 'Röd',
        orange: 'Orange',
        yellow: 'Gul',
        green: 'Grön',
        teal: 'Teal',
        blue: 'Blå',
        cyan: 'Cyan',
        purple: 'Lila',
        pink: 'Rosa',
      },
    },

    borderless: {
      displayName: 'Utan kantlinje',
      description: 'Ta bort kantringen från avataren',
      trueLabel: 'Ingen kantlinje',
      falseLabel: 'Med kantlinje',
    },

    badgeImageSrc: {
      displayName: 'Badge bild-URL',
      description: 'URL till en bild som visas som badge-overlay (t.ex. en logotyp eller plattformsikon)',
      placeholder: 'https://example.com/logo.png',
      editorHint: 'Lämna tom för att inte visa någon badge',
    },

    badgeImageAlt: {
      displayName: 'Badge alt-text',
      description: 'Tillgänglig beskrivning av badge-bilden',
      placeholder: 'Varumärkeslogotyp',
    },

    badgePlacement: {
      displayName: 'Badge position',
      description: 'Var badgen placeras i förhållande till avataren',
      valueLabels: {
        'top-right': 'Uppe till höger',
        'top-left': 'Uppe till vänster',
        'bottom-right': 'Nere till höger',
        'bottom-left': 'Nere till vänster',
      },
    },

    badgeSize: {
      displayName: 'Badge storlek',
      description: 'Storleken på badge-overlayen',
      valueLabels: {
        sm: 'Liten (20px)',
        md: 'Medium (28px)',
        lg: 'Stor (36px)',
      },
    },
  },

  examples: {
    'basic': {
      name: 'Grundläggande avatar',
      description: 'Avatar med profilbild',
      category: 'vanliga',
    },
    'initials': {
      name: 'Initialer som fallback',
      description: 'Avatar som visar initialer när ingen bild är inställd',
      category: 'vanliga',
    },
    'with-badge': {
      name: 'Avatar med logotyp-badge',
      description: 'Profilfoto med en varumärkeslogotyp som badge-overlay',
      category: 'varumärke',
    },
    'large': {
      name: 'Stor hero-avatar',
      description: 'Stor avatar för hero- och profilsektioner',
      category: 'layout',
    },
  },
};
