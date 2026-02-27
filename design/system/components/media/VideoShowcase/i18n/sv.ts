/**
 * Swedish translations for VideoShowcase component
 */

export const videoShowcaseTranslations_sv = {
  displayName: 'Video Showcase',
  description: 'Video med enhetsskal och avancerade visningsalternativ',
  
  props: {
    src: {
      displayName: 'Video-URL',
      description: 'Video-URL eller sökväg',
    },
    poster: {
      displayName: 'Förhandsvisning',
      description: 'Bild som visas innan video spelar. Välj från galleri.',
    },
    youtubeUrl: {
      displayName: 'YouTube-video (valfritt)',
      description: 'YouTube embed-URL (t.ex. https://www.youtube.com/embed/...) – lämna tom om du bara vill visa förhandsvisningsbild',
    },
    aspectRatio: {
      displayName: 'Bildförhållande',
      description: 'Videons bildförhållande',
      valueLabels: {
        '16-9': '16:9 (Widescreen)',
        '9-16': '9:16 (Vertikal)',
        '4-3': '4:3 (Standard)',
        '4-5': '4:5 (Instagram)',
        '1-1': '1:1 (Kvadrat)',
        '2-3': '2:3 (Portrait)',
        'auto': 'Auto',
      },
    },
    objectFit: {
      displayName: 'Objektpassning',
      description: 'Hur videon anpassas till container',
      valueLabels: {
        contain: 'Innehåll',
        cover: 'Täck',
        fill: 'Fyll',
        none: 'Ingen',
      },
    },
    radius: {
      displayName: 'Hörnradie',
      description: 'Rundade hörn',
      valueLabels: {
        none: 'Ingen',
        sm: 'Liten',
        md: 'Medium',
        lg: 'Stor',
        xl: 'Extra stor',
        full: 'Full',
      },
    },
    autoPlay: {
      displayName: 'Auto igång',
      description: 'Starta videon automatiskt',
      trueLabel: 'Ja',
      falseLabel: 'Nej',
    },
    showPlayButton: {
      displayName: 'Visa Play-knapp',
      description: 'Visa play-knapp över videon',
      trueLabel: 'Ja',
      falseLabel: 'Nej',
    },
    maxHeight: {
      displayName: 'Max höjd',
      description: 'Maximal höjd i pixlar',
    },
    frame: {
      displayName: 'Enhetsskal',
      description: 'Visa video i enhetsskal',
      valueLabels: {
        none: 'Inget',
        'iphone-14-pro': 'iPhone 14 Pro',
        'iphone-se': 'iPhone SE',
        'pixel-7': 'Pixel 7',
      },
    },
    frameColor: {
      displayName: 'Skalfärg',
      description: 'Färg på enhetsskalet',
      valueLabels: {
        black: 'Svart',
        white: 'Vit',
        silver: 'Silver',
        gold: 'Guld',
      },
    },
    frameSize: {
      displayName: 'Skalstorlek',
      description: 'Storlek på enhetsskalet (desktop)',
    },
    mobileFrameSize: {
      displayName: 'Mobil skalstorlek',
      description: 'Storlek på enhetsskalet (mobil)',
    },
    mobileMaxWidth: {
      displayName: 'Mobil max bredd',
      description: 'Maximal bredd på mobil (utan skal)',
    },
    flagCountry: {
      displayName: 'Flaggland',
      description: 'Visa flagga i hörnet (landskod)',
    },
  },
};
