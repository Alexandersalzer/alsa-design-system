/**
 * Swedish translations for Image component
 */

export const imageTranslations_sv = {
  displayName: 'Bild',
  description: 'Responsiv bildkomponent med lazy loading och placeholders',
  
  props: {
    src: {
      displayName: 'Källa',
      description: 'Bild-URL',
    },
    alt: {
      displayName: 'Alt-text',
      description: 'Alternativ text för tillgänglighet',
    },
    width: {
      displayName: 'Bredd',
      description: 'Bildens bredd',
    },
    height: {
      displayName: 'Höjd',
      description: 'Bildens höjd',
    },
    objectFit: {
      displayName: 'Objektpassning',
      description: 'Hur bilden anpassas till container',
      valueLabels: {
        cover: 'Täck',
        contain: 'Innehåll',
        fill: 'Fyll',
        none: 'Ingen',
        'scale-down': 'Skala ner',
      },
    },
    radius: {
      displayName: 'Radie',
      description: 'Hörnradie',
      valueLabels: {
        none: 'Ingen',
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
        xl: 'Extra stor',
        full: 'Full',
      },
    },
    aspectRatio: {
      displayName: 'Bildförhållande',
      description: 'Bildförhållande (t.ex. 16/9)',
    },
    loading: {
      displayName: 'Laddning',
      description: 'Laddningsstrategi',
      valueLabels: {
        lazy: 'Lat',
        eager: 'Ivrig',
      },
    },
    priority: {
      displayName: 'Prioritet',
      description: 'Prioriterad laddning',
    },
    hoverZoom: {
      displayName: 'Hover-zoom',
      description: 'Aktivera zoom vid hovring',
    },
    tint: {
      displayName: 'Färgton',
      description: 'Accentfärgton över bilden',
      valueLabels: {
        none: 'Ingen',
        accent: 'Accent',
      },
    },
  },
};
