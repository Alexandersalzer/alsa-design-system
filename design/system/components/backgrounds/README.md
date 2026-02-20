# Background System - Complete Documentation

## 📚 Overview

Ett komplett, skalbart system för bakgrunder i Blimpify. Stödjer 4 typer av bakgrunder med full design token-integration.

## 🎨 Background Types

### 1. GenerativeBackground
**Procedurell vattenfärg-liknande bakgrund med canvas-baserad noise.**

```tsx
<GenerativeBackground
  variant="vibrant"           // 'subtle' | 'medium' | 'vibrant'
  colorScheme="accent"        // 'accent' | 'primary' | 'success' | 'warning' | 'info'
  seed={1337}                 // Deterministiskt seed
  intensity={1.0}             // 0.0 - 1.0 (effektstyrka)
  blurAmount={18}             // 0 - 50 (blur radius i px)
/>
```

**Användning i JSON:**
```json
{
  "id": "hero_ABC123",
  "background": "generative",
  "generativeVariant": "vibrant",
  "generativeColorScheme": "accent",
  "generativeSeed": 42,
  "generativeIntensity": 1.0,
  "generativeBlur": 20
}
```

---

### 2. GradientBackground
**Moderna gradienter (mesh, radial, conic, linear) med animations-stöd.**

```tsx
<GradientBackground
  type="mesh"                 // 'mesh' | 'radial' | 'conic' | 'linear'
  colorScheme="primary"       // 'accent' | 'primary' | 'success' | 'warning' | 'info'
  animated={true}             // Animerad gradient
  intensity={1.0}             // 0.0 - 1.0 (opacity)
/>
```

**Användning i JSON:**
```json
{
  "id": "features_XYZ789",
  "background": "gradient",
  "gradientType": "mesh",
  "gradientColorScheme": "primary",
  "gradientAnimated": false,
  "gradientIntensity": 0.9
}
```

---

### 3. PatternBackground
**Geometriska mönster (dots, lines, grid, diagonal, hexagon).**

```tsx
<PatternBackground
  type="dots"                 // 'dots' | 'lines' | 'grid' | 'diagonal' | 'hexagon'
  colorScheme="neutral"       // 'accent' | 'primary' | 'success' | 'warning' | 'info' | 'neutral'
  density="normal"            // 'sparse' | 'normal' | 'dense'
  animated={false}            // Animerat mönster
  opacity={0.15}              // 0.0 - 1.0
/>
```

**Användning i JSON:**
```json
{
  "id": "about_DEF456",
  "background": "pattern",
  "patternType": "grid",
  "patternColorScheme": "neutral",
  "patternDensity": "sparse",
  "patternAnimated": false,
  "patternOpacity": 0.1
}
```

---

### 4. VideoBackground
**Video-bakgrund med overlay och kontroller.**

```tsx
<VideoBackground
  src="/videos/hero.mp4"      // Video URL
  poster="/images/poster.jpg" // Poster image (optional)
  fit="cover"                 // 'cover' | 'contain' | 'fill'
  overlayType="dark"          // 'none' | 'dark' | 'light' | 'gradient'
  overlayOpacity={0.3}        // 0.0 - 1.0
  playbackRate={1.0}          // 0.5 - 2.0 (slow motion / speed up)
/>
```

**Användning i JSON:**
```json
{
  "id": "hero_VIDEO123",
  "background": "video",
  "videoSrc": "/videos/hero-bg.mp4",
  "videoPoster": "/images/hero-poster.jpg",
  "videoFit": "cover",
  "videoOverlayType": "dark",
  "videoOverlayOpacity": 0.4,
  "videoPlaybackRate": 0.8
}
```

---

### 6. ImageBackground med accent-tint (B&W → accent)

För sektioner eller innehållsbilder som ska följa accentfärg och dark/light:

- **Sektion:** `background: "image"` + `backgroundTint: "accent"` och ev. `backgroundThemeAware: true`.
- **Image-komponent:** `tint="accent"` och ev. `themeAware={true}`.

**Bildspec för konsekvent resultat:** Använd bilder med **vit bakgrund** och **svart mönster/motiv** (eller ren gråskala). Då ger `grayscale + sepia + hue-rotate(--accent-hue)` accentton på motivet; med `themeAware` inverteras bilden i dark mode så kontrasten behålls. Token `--accent-hue` sätts från `design.json` (accentColor).

---

## 🎯 Background Presets

Fördefinierade kombinationer för snabb implementation:

### Generative Presets
```typescript
import { GENERATIVE_PRESETS } from '@blimpify-im/ui/backgrounds';

// hero-vibrant: Kraftfull vattenfärg för hero-sections
// subtle-accent: Diskret vattenfärg för content-sections
// calm-primary: Lugn blå vattenfärg
// success-soft: Mjuk grön vattenfärg
```

### Gradient Presets
```typescript
import { GRADIENT_PRESETS } from '@blimpify-im/ui/backgrounds';

// mesh-modern: Modern mesh-gradient à la Stripe
// radial-hero: Klassisk radial gradient för hero
// conic-animated: Roterande färghjul
```

### Pattern Presets
```typescript
import { PATTERN_PRESETS } from '@blimpify-im/ui/backgrounds';

// dots-subtle: Diskreta prickar
// grid-tech: Teknisk grid för SaaS/tech
// lines-minimal: Minimalistiska linjer
```

### Layered Presets
```typescript
import { LAYERED_PRESETS } from '@blimpify-im/ui/backgrounds';

// hero-rich: Rik hero med gradient + pattern
// video-overlay: Video med generativ overlay
```

**Användning:**
```json
{
  "id": "hero_ABC",
  "backgroundPreset": "hero-vibrant"
}
```

---

## 🏗️ Architecture

### Design Token Integration
Alla bakgrunder använder design tokens från `snippet.tsx`:

```css
/* Accent color scheme */
--gen-bg-subtle-base: var(--foundation-accent-100);
--gen-bg-subtle-accent: var(--foundation-accent-200);
--gen-bg-subtle-highlight: var(--foundation-accent-50, #FFFFFF);

/* Primary, Success, Warning, Info följer samma mönster */
```

**Fördelar:**
- ✅ Automatisk anpassning till vald accent-färg
- ✅ Konsistent visuell identitet
- ✅ Enkel att ändra globalt

### Component Structure
```
backgrounds/
├── GenerativeBackground/
│   ├── GenerativeBackground.tsx
│   └── GenerativeBackground.module.css
├── GradientBackground/
│   ├── GradientBackground.tsx
│   └── GradientBackground.module.css
├── PatternBackground/
│   ├── PatternBackground.tsx
│   └── PatternBackground.module.css
├── VideoBackground/
│   ├── VideoBackground.tsx
│   └── VideoBackground.module.css
├── background-presets.ts
├── index.ts
└── README.md
```

---

## 📖 Usage Examples

### Basic Usage in Section
```tsx
import { Section } from '@blimpify-im/ui';

<Section
  background="generative"
  generativeVariant="vibrant"
  generativeColorScheme="accent"
  generativeSeed={1337}
>
  {/* Content */}
</Section>
```

### JSON Configuration
```json
{
  "type": "section",
  "id": "hero_12345",
  "background": "gradient",
  "gradientType": "mesh",
  "gradientColorScheme": "primary",
  "gradientAnimated": true,
  "content": {
    "heading": "Welcome",
    "text": "Hero section med animated mesh gradient"
  }
}
```

### Using Presets
```typescript
import { getBackgroundPreset } from '@blimpify-im/ui/backgrounds';

const preset = getBackgroundPreset('hero-vibrant');
// Returns: BackgroundPreset object med all config
```

---

## 🎨 Color Schemes

Alla background-typer stödjer följande color schemes:

| Color Scheme | Foundation Tokens | Use Case |
|--------------|-------------------|----------|
| `accent` | `--foundation-accent-*` | Default, använder accentColor från design.json |
| `primary` | `--foundation-primary-*` | Blå toner, brand-fokuserad |
| `success` | `--foundation-success-*` | Grön, success states |
| `warning` | `--foundation-warning-*` | Orange/gul, warnings |
| `info` | `--foundation-info-*` | Cyan, informational |
| `neutral` | `--color-neutral-*` | Grå, minimal (endast Pattern) |

---

## ⚡ Performance

### Optimizations Implemented
- ✅ Canvas rendering med max 2x DPR (device pixel ratio)
- ✅ ResizeObserver för effektiv resize-hantering
- ✅ CSS will-change för animationer
- ✅ pointer-events: none för backgrounds
- ✅ Respects prefers-reduced-motion

### Best Practices
```tsx
// ✅ Good: Använd subtle variant för content-heavy sections
<Section background="generative" generativeVariant="subtle" />

// ✅ Good: Reducera blur på mobil
<Section 
  background="generative" 
  generativeBlur={isMobile ? 12 : 18} 
/>

// ❌ Avoid: För många animerade backgrounds på samma sida
// ❌ Avoid: Vibrant variant + dense patterns = för busy
```

---

## 🚀 Roadmap

### Completed (Fas 1-3)
- ✅ GenerativeBackground med colorScheme, intensity, blur
- ✅ GradientBackground (4 typer)
- ✅ PatternBackground (5 typer)
- ✅ VideoBackground med overlays
- ✅ Background presets system
- ✅ Full design token integration

### Future (Fas 4-5)
- [ ] BackgroundManager component (unified API)
- [ ] Layer system (stacking backgrounds)
- [ ] Blend mode support
- [ ] Animated GenerativeBackground (RAF loop)
- [ ] Parallax effects
- [ ] Dark mode adaptations
- [ ] WebGL optimization

---

## 📝 Migration Guide

### Från Legacy till Nya Systemet

**Before:**
```json
{
  "background": "generative",
  "generativeVariant": "subtle",
  "generativeSeed": 1337
}
```

**After (med nya props):**
```json
{
  "background": "generative",
  "generativeVariant": "vibrant",
  "generativeColorScheme": "primary",
  "generativeSeed": 1337,
  "generativeIntensity": 0.9,
  "generativeBlur": 20
}
```

**Breaking Changes:**
- Ingen (alla nya props är optional med defaults)

---

## 🐛 Troubleshooting

### Canvas inte synlig
- ✅ Kontrollera att `background="generative"` är satt
- ✅ Kolla z-index på content (bör vara > 0)
- ✅ Inspektera CSS custom properties i DevTools

### Färger inte uppdaterade
- ✅ Kontrollera att design tokens finns i snippet.tsx
- ✅ Rensa Next.js cache: `rm -rf .next`
- ✅ Verifiera colorScheme prop

### Video spelar inte
- ✅ Kontrollera att `videoSrc` är korrekt
- ✅ Video måste vara muted för autoplay
- ✅ Testa med poster image först

---

## 📚 API Reference

Se TypeScript interfaces i respektive komponent-fil för komplett API-dokumentation.

---

**Built with ❤️ for Blimpify**
