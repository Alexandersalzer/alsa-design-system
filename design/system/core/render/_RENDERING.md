# Section Rendering Flow Documentation

## Overview
This document explains the complete flow from URL request to rendered sections in the `[slug]` directory of the client-next application.

## 🔄 Complete Flow: From URL to Rendered Sections

### 1. 🌐 URL Request
```
User navigates to: /sv/hem
```

### 2. 📄 Next.js Router - `page.tsx`
```tsx
export default async function Page({ params }: PageProps) {
  const { locale, slug } = await params; // → "sv", "hem"
```

**What happens:**
- Next.js router triggers this server component
- `params` comes from URL: `[locale]/[slug]` → `sv/hem`
- `locale = "sv"`, `slug = "hem"`

### 3. 💾 Data Fetching - `getPageContent()`
```tsx
const { sections, order } = await getPageContent(locale, slug);
```

**In `contentLoader.ts`:**
```tsx
// 1. Build file path
const pageFilePath = path.join(process.cwd(), 'public', 'content', 'sv', 'hem.json');

// 2. Read JSON file
const fileContent = await fs.readFile(pageFilePath, 'utf8');
const pageData = JSON.parse(fileContent);

// 3. Return only what's needed
return {
  sections: pageData.sections || {},     // → Complete sections object
  order: pageData.order || []            // → ["hero_jVaWmY", "hero_jVaWmY"]
};
```

**Result:**
```tsx
sections = {
  "hero_jVaWmY": {
    type: "hero",
    patterns: {
      "sectionBody_fdsH2a": { type: "sectionBody", components: {...} },
      "spinningLogos_s5ZvJd": { type: "spinningLogos", settings: {...} },
      "media_p9Bj3v": { type: "media", components: {...} }
    },
    order: ["sectionBody_fdsH2a", "spinningLogos_s5ZvJd", "media_p9Bj3v"]
  }
}
order = ["hero_jVaWmY", "hero_jVaWmY"]
```

### 4. 🎯 Props Passing - Server → Client
```tsx
return (
  <PageLayout
    sectionsData={sections}  // → Complete sections data
    sectionOrder={order}     // → Rendering order
  />
);
```

### 5. 🖥️ Client Component - `child.tsx`
```tsx
export default function PageLayout({ sectionsData, sectionOrder }: PageLayoutProps) {
  return (
    <main>
      <Sections 
        sections={sectionsData}   // → Forward data
        order={sectionOrder} // → Forward order
      />
    </main>
  );
}
```

### 6. 🔄 Sections Rendering - `renderSections.tsx`

#### A. Sections Component Start:
```tsx
export function Sections({ sections, order }: SectionsProps) {
  return (
    <>
      {order.map((sectionKey, index) => {
        // sectionKey = "hero_jVaWmY" (first iteration)
        // index = 0
        const sectionData = sections[sectionKey]; // → Fetch section data
        const uniqueKey = `${sectionKey}-${index}`; // → "hero_jVaWmY-0"
        return renderSection({ sectionData, sectionKey: uniqueKey });
      })}
    </>
  );
}
```

#### B. renderSection Function:
```tsx
export function renderSection({ sectionData, sectionKey }: RenderSectionProps) {
  // sectionData = { type: "hero", patterns: {...}, order: [...] }
  const { type, patterns } = sectionData;
  const patternOrder = sectionData.order; // → ["sectionBody_fdsH2a", "spinningLogos_s5ZvJd", "media_p9Bj3v"]
  
  const renderedPatterns = patternOrder.map((patternKey, patternIndex) => {
    const pattern = patterns[patternKey]; // → Fetch pattern data
    return renderPattern(pattern, patternIndex);
  });
  
  return (
    <Section key={sectionKey} id={`${type}-section`}>
      {renderedPatterns}
    </Section>
  );
}
```

#### C. renderPattern Function (for each pattern):
```tsx
const renderPattern = (pattern: any, index: number) => {
  // Pattern 1: { type: "sectionBody", components: {...} }
  // Pattern 2: { type: "spinningLogos", settings: {...}, components: {...} }
  // Pattern 3: { type: "media", components: {...} }
  
  const PatternComponent = patternRegistry[pattern.type];
  // → SectionBody, SpinningBanner, or MediaPattern
  
  
  return (
    <Container useMediaWidth={useMediaWidth}>
      <PatternComponent {...pattern} />
    </Container>
  );
};
```

### 7. 🎨 Pattern Component Rendering

#### For SectionBody:
```tsx
// Receives: { type: "sectionBody", components: { tag_qyZsXv: {...}, heading_lKz6fL: {...}, ... } }
// Extracts: heading, body, tag, button from components
// Renders: <VStack><Tag /><Typography /><Typography /><Button /></VStack>
```

#### For SpinningBanner:
```tsx
// Receives: { type: "spinningLogos", settings: {...}, components: { logo_huel: {...}, ... } }
// Extracts: logos array, speed, direction from settings
// Renders: <CarouselAnimation><img /><img />...</CarouselAnimation>
```

#### For MediaPattern:
```tsx
// Receives: { type: "media", components: { video_p9Bj3v: {...} } }
// Extracts: src, poster from video component
// Renders: <VideoShowcase src="..." poster="..." />
```

### 8. 🎯 Final HTML Structure
```html
<main>
  <section id="hero-section">
    <div class="container"> <!-- useMediaWidth=false -->
      <!-- SectionBody content: tag, heading, body, button -->
    </div>
    <div class="container"> <!-- useMediaWidth=false -->
      <!-- SpinningBanner content: rotating logos -->
    </div>
    <div class="container-media-width"> <!-- useMediaWidth=true if set -->
      <!-- MediaPattern content: video player -->
    </div>
  </section>
  <section id="hero-section"> <!-- Duplicate section -->
    <!-- Same content repeated -->
  </section>
</main>
```

## 📊 Data Flow Summary
```
URL (/sv/hem) 
  ↓
page.tsx (Server Component)
  ↓ 
getPageContent("sv", "hem")
  ↓
Read hem.json → { sections: {...}, order: [...] }
  ↓
PageLayout (Client Component)
  ↓
Sections component
  ↓
sectionOrder.map() → renderSection() for each section
  ↓
patternOrder.map() → renderPattern() for each pattern
  ↓
patternRegistry[pattern.type] → SectionBody/SpinningBanner/MediaPattern
  ↓
HTML DOM rendered
```

## 🏗️ Architecture Benefits

### ✅ Type Safety
- Complete TypeScript interfaces from JSON to components
- Compile-time validation of data structure
- IntelliSense support throughout the flow

### ✅ Performance Optimized
- Server-side data fetching with caching
- Lightweight client components
- Minimal prop drilling

### ✅ Scalable Pattern System
- Dynamic component registry
- JSON-driven content structure
- Settings-based configuration per pattern

### ✅ Developer Experience
- Clear separation of concerns
- Predictable data flow
- Easy debugging with clear component boundaries

## 🔧 Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `page.tsx` | Server component, data fetching | `/src/app/[locale]/[slug]/` |
| `child.tsx` | Client wrapper component | `/src/app/[locale]/[slug]/` |
| `renderSections.tsx` | Core rendering logic | `/design/cms/utils/` |
| `contentLoader.ts` | File system operations | `/design/cms/wrappers/content/services/` |
| Pattern Registry | Component mapping | `/design/system/patterns/client/` |
| Pattern Components | Individual renderers | `/design/system/patterns/` |

## 🎯 Pattern Settings

Patterns can include a `settings` object to control rendering behavior:

```json
{
  "media_pattern": {
    "type": "media",
    "settings": {
      "useMediaWidth": true  // Makes Container use full viewport width
    },
    "components": { ... }
  }
}
```

## 🚀 Future Extensions

This architecture supports easy extension for:
- New pattern types via registry
- Additional Container settings
- Custom section layouts
- Internationalization enhancements
- Performance optimizations

The entire flow is **reactive** and **type-safe** from JSON file to final rendering! 🚀