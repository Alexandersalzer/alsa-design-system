/**
 * English translations for VideoShowcase component
 */

export const videoShowcaseTranslations_en = {
  displayName: 'Video Showcase',
  description: 'Video with device frames and advanced display options',
  defaultSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  
  props: {
    src: {
      displayName: 'Video URL',
      description: 'Video URL or path',
    },
    poster: {
      displayName: 'Thumbnail',
      description: 'Thumbnail image shown before video plays',
    },
    aspectRatio: {
      displayName: 'Aspect Ratio',
      description: 'Video aspect ratio',
      valueLabels: {
        '16-9': '16:9 (Widescreen)',
        '9-16': '9:16 (Vertical)',
        '4-3': '4:3 (Standard)',
        '4-5': '4:5 (Instagram)',
        '1-1': '1:1 (Square)',
        '2-3': '2:3 (Portrait)',
        'auto': 'Auto',
      },
    },
    objectFit: {
      displayName: 'Object Fit',
      description: 'How video fits container',
      valueLabels: {
        contain: 'Contain',
        cover: 'Cover',
        fill: 'Fill',
        none: 'None',
      },
    },
    radius: {
      displayName: 'Corner Radius',
      description: 'Rounded corners',
      valueLabels: {
        none: 'None',
        sm: 'Small',
        md: 'Medium',
        lg: 'Large',
        xl: 'Extra Large',
        full: 'Full',
      },
    },
    showPlayButton: {
      displayName: 'Show Play Button',
      description: 'Show play button overlay',
    },
    maxHeight: {
      displayName: 'Max Height',
      description: 'Maximum height in pixels',
    },
    frame: {
      displayName: 'Device Frame',
      description: 'Show video in device frame',
      valueLabels: {
        none: 'None',
        'iphone-14-pro': 'iPhone 14 Pro',
        'iphone-se': 'iPhone SE',
        'pixel-7': 'Pixel 7',
      },
    },
    frameColor: {
      displayName: 'Frame Color',
      description: 'Device frame color',
      valueLabels: {
        black: 'Black',
        white: 'White',
        silver: 'Silver',
        gold: 'Gold',
      },
    },
    frameSize: {
      displayName: 'Frame Size',
      description: 'Device frame size (desktop)',
    },
    mobileFrameSize: {
      displayName: 'Mobile Frame Size',
      description: 'Device frame size (mobile)',
    },
    mobileMaxWidth: {
      displayName: 'Mobile Max Width',
      description: 'Maximum width on mobile (without frame)',
    },
    flagCountry: {
      displayName: 'Flag Country',
      description: 'Show flag in corner (country code)',
    },
  },
};
