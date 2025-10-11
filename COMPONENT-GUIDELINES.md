# Blimpify UI - Component Guidelines

En guide för hur komponenter ska byggas och användas i Blimpify Design System.

---

## 📋 Innehållsförteckning

1. [Designprinciper](#designprinciper)
2. [Ansvarfördelning](#ansvarfördelning)
3. [Komponentstruktur](#komponentstruktur)
4. [Props-standarder](#props-standarder)
5. [Styling-regler](#styling-regler)
6. [Best Practices](#best-practices)

---

## 🎨 Designprinciper

### Separation of Concerns

Blimpify UI följer en tydlig separation mellan **struktur**, **innehåll** och **tema**:

| **Vad** | **Var det styrs** | **Exempel** |
|---------|-------------------|-------------|
| **Layout & Struktur** | Blimpify UI | Grid columns, Stack spacing, Card layouts |
| **Innehåll** | Hemsida/Frontend | Text, bilder, data, länkar |
| **Spacing** | Hemsida/Frontend | `paddingTop`, `paddingBottom` |
| **Text-storlek** | Hemsida/Frontend | `textScale="sm\|md\|lg"` |
| **Färger & Typsnitt** | Design Tokens | `--accent-500`, `Red Hat Display` |
| **Animationer** | Blimpify UI | Hover, transitions, transforms |

### Varför denna uppdelning?

1. **Blimpify UI** = Återanvändbar struktur som fungerar för alla kunder
2. **Hemsida** = Anpassat innehåll och fine-tuning per kund
3. **Design Tokens** = Kundspecifikt tema (färger, typsnitt, radius)

---

## 🏗️ Ansvarfördelning

### Blimpify UI ansvarar för:

#### ✅ Layout & Struktur
- Grid-layouts (antal kolumner, gap, alignment)
- Stack-layouts (vertikal spacing, alignment)
- Card-komponenter (padding, radius, shadows)
- Responsivitet (breakpoints, collapse-beteenden)

**Exempel:**
```tsx
// I komponenten (Blimpify UI)
<Grid 
  columns={2} 
  gap="lg" 
  collapseOn="tablet"
  minItemWidth="300px"
>
  {/* content */}
</Grid>
```

#### ✅ Typografi-struktur
- Vilka Typography-komponenter som används
- Varianter baserade på textScale
- Font-weights (semibold, bold, medium)
- Line-heights

**Exempel:**
```tsx
// I komponenten (Blimpify UI)
<Typography 
  variant={textScale === 'lg' ? 'display-md' : textScale === 'sm' ? 'h3' : 'h2'}
  weight="semibold"
  color="primary"
  as="h2"
>
  {heading}
</Typography>
```

#### ✅ Animationer & Interaktivitet
- Hover-effekter (transform, shadow, color)
- Transitions (timing, easing)
- Active states
- Loading states

**Exempel:**
```tsx
// I komponenten (Blimpify UI)
.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}
```

#### ✅ Default-värden
- Default padding (om inte specificerat)
- Default textScale (oftast 'md')
- Default varianter

**Exempel:**
```tsx
// I komponenten (Blimpify UI)
export const PKLAbout: React.FC<PKLAboutProps> = ({ 
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  // ...
}
```

---

### Frontend/Hemsida ansvarar för:

#### ✅ Innehåll
- All text (headings, descriptions, labels)
- Alla bilder (URLs, alt-text)
- All data (stats, team members, services, FAQs)
- Länkar (hrefs)
- Callbacks (onClick handlers)

**Exempel:**
```tsx
// På hemsidan (Frontend)
<PKLAbout
  content={{
    label: "Vår historia",
    heading: "Vi förstår löneprocesser",
    description: "PKL Consulting grundades 2010...",
    stats: [
      { value: "15+", label: "År av expertis" },
      { value: "500+", label: "Nöjda kunder" }
    ],
    ctaText: "Boka ett möte",
    ctaHref: "/sv/kontakt",
    image: "https://..."
  }}
/>
```

#### ✅ Spacing
- Padding mellan sektioner (`paddingTop`, `paddingBottom`)
- Custom spacing om behövs

**Exempel:**
```tsx
// På hemsidan (Frontend)
<PKLAbout
  paddingTop="var(--foundation-space-24)"
  paddingBottom="var(--foundation-space-24)"
/>
```

#### ✅ Text-storlek
- Kontroll av typografi-skala via `textScale`

**Exempel:**
```tsx
// På hemsidan (Frontend)
<PKLAbout
  textScale="lg"  // Större headers och paragrafer
/>
```

#### ✅ Varianter (om tillgängligt)
- Visuella varianter för olika användningsfall

**Exempel:**
```tsx
// På hemsidan (Frontend)
<PKLCTA
  variant="gradient"  // eller "bordered", "default"
/>
```

---

### Design Tokens ansvarar för:

#### ✅ Tema-variabler
- Färgpaletter (accent, primary, surface, text, border)
- Typsnitt (font-family)
- Border-radius scale (sm, md, lg, xl)
- Shadows
- Dark/Light mode

**Plats:** `/public/design/design-tokens.css` (per kund)

**Exempel:**
```css
:root {
  /* Accent Color */
  --accent-500: #3b82f6 !important;
  
  /* Typography */
  --font-family-primary: var(--font-red-hat-display) !important;
  
  /* Radius */
  --radius-lg: 12px !important;
  
  /* Base font size */
  --font-size-base: 20px;
}
```

---

## 🧩 Komponentstruktur

### Standard Props Interface

Alla PKL-komponenter följer detta mönster:

```tsx
export interface PKL[ComponentName]Content {
  // Innehåll props
  label?: string;           // Optional accent label
  heading: string;          // Main heading
  description: string;      // Description text
  // ... mer innehåll specifikt för komponenten
}

export interface PKL[ComponentName]Props {
  content: PKL[ComponentName]Content;   // Innehåll
  id?: string;                          // Section ID (för anchor links)
  paddingTop?: string;                  // Top padding
  paddingBottom?: string;               // Bottom padding
  textScale?: 'sm' | 'md' | 'lg';      // Typography scale
  onCtaClick?: () => void;              // Optional callback
}
```

### Komponent-implementation

```tsx
export const PKL[ComponentName]: React.FC<PKL[ComponentName]Props> = ({ 
  content,
  id = "default-id",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { heading, description, /* ... */ } = content;

  return (
    <>
      <style>{/* CSS här */}</style>
      
      <Section 
        id={id}
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop,
          paddingBottom
        }}
      >
        {/* Layout och struktur här */}
      </Section>
    </>
  );
};
```

---

## 🎛️ Props-standarder

### Obligatoriska Props

#### `content` (Content Interface)
Innehåller allt innehåll för komponenten.

**Alltid inkludera:**
- `heading: string` - Huvudrubrik
- `description: string` - Beskrivande text

**Ofta inkluderat:**
- `label?: string` - Liten accent-label ovanför heading
- `ctaText?: string` - Call-to-action knapptext
- `ctaHref?: string` - CTA-länk
- Komponent-specifika fält (stats, members, services, etc.)

### Valfria Props

#### `id?: string`
- Default: `"component-name"`
- Används för anchor links (`#component-name`)

#### `paddingTop?: string`
- Default: `'var(--foundation-space-24)'`
- Accepterar alla spacing-tokens eller custom CSS-värden

#### `paddingBottom?: string`
- Default: `'var(--foundation-space-24)'`
- Accepterar alla spacing-tokens eller custom CSS-värden

#### `textScale?: 'sm' | 'md' | 'lg'`
- Default: `'md'`
- Styr typografi-storleken för hela sektionen

**Mapping:**
- `sm` → Mindre text (h3, body-sm)
- `md` → Normal text (h2, body-md)
- `lg` → Större text (display-md, body-xl)

#### `variant?` (vissa komponenter)
- Visuella varianter för olika användningsfall
- Exempel: `'default' | 'gradient' | 'bordered'`

---

## 🎨 Styling-regler

### 1. Använd ALLTID Design Tokens

**✅ Gör så här:**
```tsx
style={{
  backgroundColor: 'var(--surface-card)',
  color: 'var(--text-primary)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--foundation-space-8)'
}}
```

**❌ INTE så här:**
```tsx
style={{
  backgroundColor: '#262626',
  color: '#ffffff',
  borderRadius: '12px',
  padding: '32px'
}}
```

### 2. Responsivitet via Media Queries

**Breakpoints:**
- Mobile: `max-width: 768px`
- Tablet: `max-width: 1024px`
- Desktop: `min-width: 1025px`

**Exempel:**
```tsx
@media (max-width: 768px) {
  .component-grid {
    grid-template-columns: 1fr;
    gap: var(--foundation-space-6);
  }
}
```

### 3. Typography enligt textScale

**Implementera alltid textScale-mapping:**

```tsx
// Headings
<Typography 
  variant={
    textScale === 'lg' ? 'display-md' : 
    textScale === 'sm' ? 'h3' : 
    'h2'
  }
  weight="semibold"
  color="primary"
  as="h2"
>
  {heading}
</Typography>

// Body text
<Typography 
  variant={
    textScale === 'lg' ? 'body-xl' : 
    textScale === 'sm' ? 'body-sm' : 
    'body-md'
  }
  color="secondary"
>
  {description}
</Typography>

// Labels
<Typography 
  variant="label-sm"
  color="accent"
  weight="medium"
>
  {label}
</Typography>
```

### 4. Konsekvent Label-styling

**Alla labels ska använda:**
- Variant: `label-sm`
- Color: `accent`
- Weight: `medium`

**Exempel:**
```tsx
{label && (
  <Typography 
    variant="label-sm" 
    color="accent"
    weight="medium"
  >
    {label}
  </Typography>
)}
```

### 5. Konsekvent CTA-styling

**Alla primära CTA-knappar ska använda:**
- Variant: `primary`
- Size: `lg`

**Exempel:**
```tsx
<Button 
  variant="primary" 
  size="lg"
  onClick={handleCtaClick}
>
  {ctaText}
</Button>
```

---

## 📐 Komponent-typer och deras struktur

### Pattern-komponenter (Sections)

**Placering:** `design/system/components/patterns/client/`

**Struktur:**
```
PKLComponentName/
├── PKLComponentName.tsx    # Huvudkomponent
├── index.ts                # Export
└── (optional) ComponentName.css  # Om CSS är mycket
```

**Fil-struktur:**
```tsx
// ===============================================
// PKLComponentName.tsx
// BESKRIVNING AV KOMPONENTEN
// ===============================================

'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Section } from '../../../../../system/layout/frames/section/Section';
// ... andra imports

// ===== TYPE DEFINITIONS =====

export interface PKL[Name]Content {
  label?: string;
  heading: string;
  description: string;
  // ... mer innehåll
}

export interface PKL[Name]Props {
  content: PKL[Name]Content;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
  // ... andra props
}

// ===== MAIN COMPONENT =====

export const PKL[Name]: React.FC<PKL[Name]Props> = ({ 
  content, 
  id = "pkl-component",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { heading, description } = content;

  return (
    <>
      <style>{`
        /* CSS här */
      `}</style>
      
      <Section 
        id={id} 
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop,
          paddingBottom
        }}
      >
        {/* Layout här */}
      </Section>
    </>
  );
};
```

---

## 🔧 Props-standarder

### Content Prop

**Alltid separera innehåll från konfiguration:**

```tsx
// ✅ BRA - Allt innehåll i content-objektet
<PKLAbout
  content={{
    heading: "Vi förstår löneprocesser",
    description: "...",
    stats: [...],
    image: "..."
  }}
  paddingTop="var(--foundation-space-24)"
  textScale="lg"
/>

// ❌ DÅLIGT - Innehåll som separata props
<PKLAbout
  heading="Vi förstår löneprocesser"
  description="..."
  stats={[...]}
  image="..."
  paddingTop="var(--foundation-space-24)"
  textScale="lg"
/>
```

### Standard Props (alla komponenter)

```tsx
interface StandardSectionProps {
  content: ContentInterface;        // Allt innehåll
  id?: string;                      // Section ID
  paddingTop?: string;              // Top spacing
  paddingBottom?: string;           // Bottom spacing
  textScale?: 'sm' | 'md' | 'lg';  // Typography scale
  className?: string;               // Custom classes (optional)
}
```

### Callback Props

**För knappar och interaktioner:**

```tsx
interface ComponentWithActions {
  onCtaClick?: () => void;
  onSecondaryClick?: () => void;
  onSubmit?: (data: any) => void;
}
```

**Implementation:**
```tsx
const handleCtaClick = () => {
  if (onCtaClick) {
    onCtaClick();
  } else if (ctaHref) {
    window.location.href = ctaHref;
  }
};
```

---

## 🎨 Styling-regler

### 1. CSS in JS med Design Tokens

**Använd inline `<style>` tags för komponent-specifik CSS:**

```tsx
<>
  <style>{`
    .component-container {
      max-width: var(--size-page-max-width);
      margin: 0 auto;
      padding: 0 var(--foundation-space-6);
    }
    
    .component-card {
      background: var(--surface-card);
      border: 1px solid var(--border-medium);
      border-radius: var(--radius-lg);
      padding: var(--foundation-space-8);
      transition: all 0.3s ease;
    }
    
    .component-card:hover {
      border-color: var(--accent-500);
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
  `}</style>
  
  {/* JSX här */}
</>
```

### 2. Token-kategorier

#### Spacing Tokens
```css
var(--foundation-space-1)   /* 4px */
var(--foundation-space-2)   /* 8px */
var(--foundation-space-3)   /* 12px */
var(--foundation-space-4)   /* 16px */
var(--foundation-space-6)   /* 24px */
var(--foundation-space-8)   /* 32px */
var(--foundation-space-10)  /* 40px */
var(--foundation-space-12)  /* 48px */
var(--foundation-space-16)  /* 64px */
var(--foundation-space-24)  /* 96px */
```

#### Color Tokens
```css
/* Surface */
var(--surface-page)      /* Sidans bakgrund */
var(--surface-card)      /* Kort/boxar */
var(--surface-subtle)    /* Subtil bakgrund */
var(--surface-muted)     /* Dämpad bakgrund */

/* Text */
var(--text-primary)      /* Huvudtext */
var(--text-secondary)    /* Sekundär text */
var(--text-tertiary)     /* Tertiär text */

/* Border */
var(--border-light)      /* Ljus kant */
var(--border-medium)     /* Medium kant */
var(--border-strong)     /* Stark kant */

/* Accent */
var(--accent-400)        /* Ljusare accent */
var(--accent-500)        /* Main accent */
var(--accent-600)        /* Mörkare accent */
```

#### Radius Tokens
```css
var(--radius-sm)    /* 6px */
var(--radius-md)    /* 8px */
var(--radius-lg)    /* 12px */
var(--radius-xl)    /* 16px */
var(--radius-2xl)   /* 24px */
var(--radius-full)  /* 9999px (rundad) */
```

#### Shadow Tokens
```css
var(--shadow-sm)
var(--shadow-md)
var(--shadow-lg)
var(--shadow-xl)
var(--shadow-2xl)
```

### 3. Responsiv Design

**Mobile-first approach:**

```tsx
// Desktop (default)
.component-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--foundation-space-8);
}

// Tablet
@media (max-width: 1024px) {
  .component-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--foundation-space-6);
  }
}

// Mobile
@media (max-width: 768px) {
  .component-grid {
    grid-template-columns: 1fr;
    gap: var(--foundation-space-4);
  }
}
```

---

## ✨ Best Practices

### 1. Konsekvent Namngivning

**Komponenter:**
- PKL-prefix för alla PKL-specifika komponenter
- PascalCase: `PKLAbout`, `PKLNavbar`, `PKLCTA`

**CSS-klasser:**
- Kebab-case med komponent-prefix
- Exempel: `pkl-about-container`, `pkl-about-stat`, `pkl-about-image`

**Props:**
- camelCase: `paddingTop`, `textScale`, `ctaText`

### 2. TypeScript Types

**Använd alltid interfaces för props:**

```tsx
// ✅ BRA
export interface PKLAboutContent {
  heading: string;
  description: string;
  stats: Array<{ value: string; label: string }>;
}

// ❌ DÅLIGT - Inline types
export const PKLAbout = ({ content }: { content: { heading: string } }) => {
  // ...
}
```

### 3. Default Values

**Sätt alltid defaults för valfria props:**

```tsx
export const Component: React.FC<Props> = ({ 
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md',
  variant = 'default'
}) => {
  // ...
}
```

### 4. Accessibility

**Semantiska element:**
```tsx
<Section as="section">
  <Typography as="h2" variant="h2">Heading</Typography>
  <Typography as="p" variant="body-md">Text</Typography>
</Section>
```

**ARIA-attribut:**
```tsx
<button
  aria-expanded={expanded}
  aria-controls="content-id"
  aria-label="Beskrivning"
>
  {/* ... */}
</button>
```

### 5. Performance

**Optimera bilder:**
```tsx
// Om Next.js Image används
import Image from 'next/image';

<Image 
  src={image} 
  alt={alt}
  width={800}
  height={600}
  loading="lazy"
/>

// Om vanlig img används (för externa URLs)
<img 
  src={image} 
  alt={alt}
  loading="lazy"
/>
```

---

## 📦 Export-struktur

### index.ts i komponentmapp

```tsx
export * from './PKLComponentName';
```

### index.ts i patterns/client

```tsx
// Alfabetisk ordning rekommenderas
export * from './PKLAbout';
export * from './PKLCTA';
export * from './PKLFAQ';
export * from './PKLFooter';
export * from './PKLNavbar';
export * from './PKLPortfolio';
export * from './PKLTeam';
// ... etc
```

---

## 🚀 Användningsexempel

### På hemsidan (Frontend)

```tsx
'use client';

import { 
  PKLNavbar, 
  PKLAbout, 
  PKLTeam, 
  PKLCTA, 
  PKLFooter 
} from '@blimpify-im/ui';

export default function HomePage() {
  return (
    <main>
      <PKLNavbar
        content={{
          logoText: "PKL Consulting",
          navigationItems: [
            { label: "Om oss", href: "/sv/om-oss" },
            { label: "Tjänster", href: "/sv/tjanster" }
          ],
          ctaText: "Get Started",
          ctaHref: "/sv/kontakt",
          heroImage: "/img/hero.jpg",
          heroTitle: "Your Hero Title",
          heroSubtitle: "Subtitle here"
        }}
      />
      
      <PKLAbout
        content={{
          label: "Om oss",
          heading: "Vi förstår löneprocesser",
          description: "Beskrivning här...",
          stats: [
            { value: "15+", label: "År" },
            { value: "500+", label: "Kunder" }
          ],
          ctaText: "Läs mer",
          ctaHref: "/sv/om-oss",
          image: "https://..."
        }}
        paddingTop="var(--foundation-space-24)"
        paddingBottom="var(--foundation-space-24)"
        textScale="lg"
      />
      
      <PKLCTA
        content={{
          heading: "Redo att börja?",
          description: "Kontakta oss idag",
          primaryButtonText: "Boka möte",
          primaryButtonHref: "/sv/kontakt"
        }}
        variant="bordered"
        textScale="lg"
      />
      
      <PKLFooter
        content={{
          logoText: "PKL Consulting",
          columns: [...],
          contactInfo: {...}
        }}
      />
    </main>
  );
}
```

---

## 🔄 Publishing Workflow

### 1. Skapa/Uppdatera komponent i Blimpify UI

```bash
cd /path/to/blimpify-ui
```

### 2. Committa ändringar

```bash
git add -A
git commit -m "Add PKLComponentName - description"
```

### 3. Bumpa version och publicera

```bash
npm version patch
npm publish --tag simon
```

### 4. Uppdatera på hemsidan

```bash
cd /path/to/customer-project
npm install @blimpify-im/ui@simon
```

---

## 📊 Checklist för nya komponenter

### Design & Struktur
- [ ] Följer PKL-namningskonvention
- [ ] Har Content interface för allt innehåll
- [ ] Har standard props (id, paddingTop, paddingBottom, textScale)
- [ ] Använder design tokens (inga hårdkodade värden)
- [ ] Responsiv design (mobile, tablet, desktop)
- [ ] Konsekvent label-styling (label-sm, accent, medium)
- [ ] Konsekvent heading-styling baserat på textScale
- [ ] Konsekvent CTA-styling (primary, lg)

### Kod-kvalitet
- [ ] TypeScript interfaces definierade
- [ ] Default-värden på alla valfria props
- [ ] Exporterad i index.ts
- [ ] Exporterad i patterns/client/index.ts
- [ ] Kommentarer och JSDoc (om komplex)

### Accessibility
- [ ] Semantiska HTML-element (Section, h2, p, button)
- [ ] ARIA-attribut där behövs
- [ ] Keyboard navigation (om interaktiv)
- [ ] Alt-text för bilder

### Testing
- [ ] Testad på desktop
- [ ] Testad på tablet
- [ ] Testad på mobile
- [ ] Testad med olika textScale (sm, md, lg)
- [ ] Testad med olika paddingTop/Bottom värden

---

## 🎯 Exempel på bra vs dålig design

### ✅ BRA - Flexibel och återanvändbar

```tsx
export const PKLAbout: React.FC<PKLAboutProps> = ({ 
  content,
  paddingTop = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  return (
    <Section style={{ paddingTop }}>
      <Typography 
        variant={textScale === 'lg' ? 'display-md' : 'h2'}
        color="primary"
      >
        {content.heading}
      </Typography>
    </Section>
  );
};

// Användning
<PKLAbout
  content={{ heading: "Custom heading" }}
  paddingTop="var(--foundation-space-32)"
  textScale="lg"
/>
```

### ❌ DÅLIGT - Hårdkodat och oflexibelt

```tsx
export const PKLAbout: React.FC<{}> = () => {
  return (
    <Section style={{ paddingTop: '96px' }}>
      <h2 style={{ 
        fontSize: '48px',
        color: '#ffffff'
      }}>
        Vi förstår löneprocesser
      </h2>
    </Section>
  );
};

// Användning - inget att konfigurera
<PKLAbout />
```

---

## 🌍 Multi-kund användning

### Samma komponent, olika teman

Komponenten är **tema-agnostisk** och använder tokens:

```tsx
// Blimpify UI (samma för alla kunder)
<div style={{ 
  background: 'var(--surface-card)',
  color: 'var(--text-primary)'
}}>
```

**Kund A (design-tokens.css):**
```css
:root {
  --surface-card: #1e1e1e;  /* Mörk */
  --text-primary: #ffffff;
}
```

**Kund B (design-tokens.css):**
```css
:root {
  --surface-card: #f5f5f5;  /* Ljus */
  --text-primary: #1a1a1a;
}
```

→ **Samma komponent, olika utseende!**

---

## 📝 Sammanfattning

### Design-filosofi:
1. **Blimpify UI** = Flexibel struktur och layout
2. **Hemsida** = Innehåll och fine-tuning
3. **Design Tokens** = Kundspecifikt tema

### Nyckelprinciper:
- ✅ Använd design tokens, aldrig hårdkodade värden
- ✅ Separera innehåll (content) från konfiguration (props)
- ✅ Konsekvent props-interface (paddingTop, textScale, etc.)
- ✅ Responsiv design för alla skärmstorlekar
- ✅ Accessibility-first (semantiska element, ARIA)
- ✅ TypeScript för type-safety

### Resultat:
- Komponenter som är återanvändbara över flera kunder
- Enkelt att anpassa utan att ändra kod
- Konsekvent design över hela sajten
- Snabbare utveckling av nya sidor

---

**Byggd med ❤️ av Blimpify**

