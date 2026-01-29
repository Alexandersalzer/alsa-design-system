/**
 * Background Usage Examples
 * 
 * Exempel på hur man använder de olika background-typerna i start.json
 */

// ===== GENERATIVE BACKGROUND EXAMPLES =====

// Example 1: Hero med vibrant accent-färg
const heroGenerative = {
  "id": "hero_ABC123",
  "type": "section",
  "background": "generative",
  "generativeVariant": "vibrant",
  "generativeColorScheme": "accent",
  "generativeSeed": 42,
  "generativeIntensity": 1.0,
  "generativeBlur": 20,
  "content": {
    "heading": "Welcome to Our Site",
    "text": "Beautiful generative background"
  }
};

// Example 2: About-sektion med subtle primary
const aboutGenerative = {
  "id": "about_DEF456",
  "type": "section",
  "background": "generative",
  "generativeVariant": "subtle",
  "generativeColorScheme": "primary",
  "generativeSeed": 1337,
  "generativeIntensity": 0.8,
  "generativeBlur": 16,
  "content": {
    "heading": "About Us"
  }
};

// Example 3: Success-sektion med grön watercolor
const successGenerative = {
  "id": "success_GHI789",
  "type": "section",
  "background": "generative",
  "generativeVariant": "medium",
  "generativeColorScheme": "success",
  "generativeSeed": 888,
  "generativeIntensity": 0.9,
  "generativeBlur": 18
};

// ===== GRADIENT BACKGROUND EXAMPLES =====

// Example 4: Modern mesh gradient för features
const featuresGradient = {
  "id": "features_JKL012",
  "type": "section",
  "background": "gradient",
  "gradientType": "mesh",
  "gradientColorScheme": "primary",
  "gradientAnimated": false,
  "gradientIntensity": 1.0,
  "content": {
    "heading": "Our Features"
  }
};

// Example 5: Animated conic gradient för hero
const heroConicGradient = {
  "id": "hero_MNO345",
  "type": "section",
  "background": "gradient",
  "gradientType": "conic",
  "gradientColorScheme": "accent",
  "gradientAnimated": true,
  "gradientIntensity": 0.7
};

// Example 6: Radial gradient för CTA
const ctaRadialGradient = {
  "id": "cta_PQR678",
  "type": "section",
  "background": "gradient",
  "gradientType": "radial",
  "gradientColorScheme": "success",
  "gradientAnimated": false,
  "gradientIntensity": 0.9
};

// ===== PATTERN BACKGROUND EXAMPLES =====

// Example 7: Subtle dots för content-sections
const contentPattern = {
  "id": "content_STU901",
  "type": "section",
  "background": "pattern",
  "patternType": "dots",
  "patternColorScheme": "neutral",
  "patternDensity": "normal",
  "patternAnimated": false,
  "patternOpacity": 0.1,
  "content": {
    "heading": "Content Section"
  }
};

// Example 8: Tech grid för SaaS
const techGrid = {
  "id": "tech_VWX234",
  "type": "section",
  "background": "pattern",
  "patternType": "grid",
  "patternColorScheme": "primary",
  "patternDensity": "sparse",
  "patternAnimated": false,
  "patternOpacity": 0.15
};

// Example 9: Animated lines för footer
const footerPattern = {
  "id": "footer_YZA567",
  "type": "section",
  "background": "pattern",
  "patternType": "lines",
  "patternColorScheme": "neutral",
  "patternDensity": "normal",
  "patternAnimated": true,
  "patternOpacity": 0.08
};

// ===== VIDEO BACKGROUND EXAMPLES =====

// Example 10: Hero med video + dark overlay
const heroVideo = {
  "id": "hero_BCD890",
  "type": "section",
  "background": "video",
  "videoSrc": "/videos/hero-background.mp4",
  "videoPoster": "/images/hero-poster.jpg",
  "videoFit": "cover",
  "videoOverlayType": "dark",
  "videoOverlayOpacity": 0.4,
  "videoPlaybackRate": 1.0,
  "content": {
    "heading": "Watch Our Story"
  }
};

// Example 11: Slow motion video med gradient overlay
const slowMotionVideo = {
  "id": "video_EFG123",
  "type": "section",
  "background": "video",
  "videoSrc": "/videos/product-demo.mp4",
  "videoPoster": "/images/product-poster.jpg",
  "videoFit": "cover",
  "videoOverlayType": "gradient",
  "videoOverlayOpacity": 0.5,
  "videoPlaybackRate": 0.7
};

// ===== USING PRESETS =====

// Example 12: Använd färdigt preset
const heroPreset = {
  "id": "hero_PRESET1",
  "type": "section",
  "backgroundPreset": "hero-vibrant"  // Använder GENERATIVE_PRESETS['hero-vibrant']
};

const gridPreset = {
  "id": "tech_PRESET2",
  "type": "section",
  "backgroundPreset": "grid-tech"  // Använder PATTERN_PRESETS['grid-tech']
};

// ===== COMBINING WITH CONTENT =====

// Example 13: Fullständig hero-sektion
const fullHeroExample = {
  "id": "hero_FULL",
  "type": "section",
  "background": "generative",
  "generativeVariant": "vibrant",
  "generativeColorScheme": "accent",
  "generativeSeed": 42,
  "generativeIntensity": 1.0,
  "generativeBlur": 20,
  "spacing": "xl",
  "height": "screen",
  "content": {
    "type": "vstack",
    "align": "center",
    "spacing": "lg",
    "items": [
      {
        "type": "heading",
        "text": "Welcome to Blimpify",
        "level": 1,
        "variant": "display"
      },
      {
        "type": "text",
        "text": "Build beautiful websites with our design system",
        "variant": "large"
      },
      {
        "type": "button",
        "text": "Get Started",
        "variant": "primary",
        "size": "large"
      }
    ]
  }
};

// ===== RESPONSIVE CONSIDERATIONS =====

// Example 14: Mobilanpassad bakgrund (reducerad komplexitet)
const responsiveBackground = {
  "id": "responsive_MOBILE",
  "type": "section",
  "background": "generative",
  "generativeVariant": "subtle",  // Subtle istället för vibrant på mobil
  "generativeColorScheme": "accent",
  "generativeSeed": 1337,
  "generativeIntensity": 0.7,  // Lägre intensity
  "generativeBlur": 12  // Mindre blur för bättre prestanda
};

export const examples = {
  heroGenerative,
  aboutGenerative,
  successGenerative,
  featuresGradient,
  heroConicGradient,
  ctaRadialGradient,
  contentPattern,
  techGrid,
  footerPattern,
  heroVideo,
  slowMotionVideo,
  heroPreset,
  gridPreset,
  fullHeroExample,
  responsiveBackground
};
