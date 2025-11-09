# Blimpify Schema System

Ett komplett TypeScript-baserat schemasystem för Blimpify IM:s frontendarkitektur som definierar strukturen för **sections**, **patterns** och **components**.

## 📁 Struktur

```
schemas/
├── types/
│   ├── base.ts           # Grundläggande interfaces och typer
│   └── index.ts         # Export för alla typer
├── sections/            # Schema för sections (hero, portfolio, etc.)
│   ├── HeroSectionSchema.ts
│   ├── PortfolioSectionSchema.ts
│   ├── TestimonialsSectionSchema.ts
│   ├── ContactSectionSchema.ts
│   └── index.ts
├── patterns/            # Schema för patterns (sectionBody, form, etc.)
│   ├── SectionBodyPatternSchema.ts
│   ├── SpinningLogosPatternSchema.ts
│   ├── MediaPatternSchema.ts
│   ├── SpinningCarouselPatternSchema.ts
│   ├── TestimonialsPatternSchema.ts
│   ├── FormPatternSchema.ts
│   └── index.ts
├── components/          # Schema för components (button, text, etc.)
│   ├── ButtonComponentSchema.ts
│   ├── TypographySchema.ts
│   ├── TagComponentSchema.ts
│   ├── ImageComponentSchema.ts
│   ├── VideoComponentSchema.ts
│   ├── TestimonialComponentSchema.ts
│   ├── InputComponentSchema.ts
│   ├── TextareaComponentSchema.ts
│   └── index.ts
├── registry.ts          # Centralt registry med utilities
└── index.ts            # Huvud-export för systemet
```

## 🔧 Användning

### Basic Import

```typescript
import { schemaRegistry, SchemaUtils } from '@blimpify-im/ui/schemas';
```

### Få ett specifikt schema

```typescript
// Hämta Button component schema
const buttonSchema = SchemaUtils.getSchema('components', 'button');

// Hämta Hero section schema
const heroSchema = SchemaUtils.getSchema('sections', 'hero');
```

### Validera typer

```typescript
// Kontrollera om en typ finns
const isValid = SchemaUtils.isValidType('components', 'button'); // true
const isInvalid = SchemaUtils.isValidType('components', 'unknown'); // false

// Få alla tillgängliga typer
const componentTypes = SchemaUtils.getTypesForCategory('components');
// ['button', 'text', 'tag', 'image', 'video', 'testimonial', 'input', 'textarea']
```

### Hämta schema-information

```typescript
// Få required props för en komponent
const requiredProps = SchemaUtils.getRequiredProps('components', 'button');
// ['label']

// Få default values
const defaultProps = SchemaUtils.getDefaultProps('components', 'button');
// { variant: 'primary', size: 'md', radius: 'md', loading: false, fullWidth: false, disabled: false }
```

## 📋 Schema-struktur

Varje schema följer detta mönster:

### ComponentSchema
```typescript
export const ButtonComponentSchema: ComponentSchema = {
  type: 'button',
  props: {
    variant: {
      type: 'enum',
      values: ['primary', 'secondary', 'accent', 'ghost', 'destructive'],
      default: 'primary',
      description: 'Visual style variant'
    },
    label: {
      type: 'string',
      required: true,
      description: 'Button text content'
    }
    // ... fler props
  }
};
```

### PatternSchema
```typescript
export const SectionBodyPatternSchema: PatternSchema = {
  type: 'sectionBody',
  props: {
    container: CommonProps.container,
    padding: CommonProps.padding
  },
  components: {
    // Definierar vilka components som kan användas i detta pattern
  }
};
```

### SectionSchema
```typescript
export const HeroSectionSchema: SectionSchema = {
  type: 'hero',
  props: {
    background: CommonProps.background,
    align: CommonProps.align
  },
  patterns: {
    // Definierar vilka patterns som kan användas i denna section
  },
  requiredPatterns: ['sectionBody'] // Alla sections måste ha sectionBody
};
```

## 🎯 Framtida möjligheter

Detta schemasystem är byggt för att kunna utökas med:

1. **Validering**: Runtime-validering av JSON-struktur mot scheman
2. **Documentation Generation**: Automatisk generering av dokumentation
3. **Form Generation**: Dynamisk generering av formulär för CMS
4. **Type Safety**: Förbättrad TypeScript-typning för content
5. **Migration Tools**: Verktyg för att migrera content mellan schemaversioner

## 🔄 Exempel: Validering (framtida funktionalitet)

```typescript
// Detta kommer att implementeras senare
import { validateContent } from '@blimpify-im/ui/schemas/validation';

const pageContent = {
  sections: {
    hero_1: {
      type: 'hero',
      props: { background: 'light' },
      patterns: { /* ... */ }
    }
  }
};

const validation = validateContent(pageContent);
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}
```

## ✅ Implementerat

- [x] Grundläggande TypeScript interfaces
- [x] Alla section-scheman (hero, portfolio, testimonials, contact, footer)
- [x] Alla pattern-scheman (sectionBody, spinningLogos, media, spinningCarousel, testimonials, form, kj)
- [x] Alla component-scheman (button, text, tag, image, video, testimonial, input, textarea, title, body)
- [x] Centralt registry med utility-funktioner
- [x] Tydlig struktur för framtida utökning
- [x] Footer-support med KJ-pattern och footer-specifika komponenter

## 🚀 Nästa steg

1. Implementera runtime-validering
2. Skapa form-generation för CMS
3. Lägg till schema-migration verktyg
4. Integrera med blimpify-ui komponenter för automatisk schema-extraktion