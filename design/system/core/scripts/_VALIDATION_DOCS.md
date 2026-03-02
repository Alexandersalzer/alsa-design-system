# Page Validation Scripts

Dokumentation för page validation scripts i Blimpify.

## Översikt

Detta system validerar att alla pages-filer och content-filer följer Blimpify:s struktur-regler.

### Vad valideras?

#### Fil-struktur (Steps 1-5):
1. **Directory Structure** - Kontrollerar att alla nödvändiga mappar finns
2. **Required Files** - Kontrollerar att obligatoriska filer finns (navbar, footer, start, design)
3. **Page Names** - Validerar att page-namn följer namnkonventioner
4. **Content Files** - Kontrollerar att alla pages har motsvarande content-filer för alla språk
5. **File Consistency** - Hittar "föräldralösa" content-filer utan struktur-fil

#### JSON-innehåll (Step 6):
6. **Page Content Validation** - Validerar JSON-struktur och innehåll:
   - **Section Types** - Endast 12 tillåtna section types
   - **Section Occurrences** - Max en av varje section type per page
   - **Section Positioning** - Hero först, Contact sist
   - **Pattern Structure** - SectionHeader pattern måste finnas och vara först
   - **JSON Structure** - Sections, order, patterns korrekt strukturerade
   - **SEO Fields** - Title och description finns och har optimal längd

## Användning

### I blimpify-workspace

```bash
# Validera current working directory
npm run validate:pages

# Validera specifik klient
npm run validate:client --client=template-26feb20

# Validera med specifika locales
npm run validate:pages -- ./clients/template-26feb20/public sv,en
```

### Med tsx direkt

```bash
# Från blimpify-ui
cd blimpify-ui
tsx design/system/core/scripts/validatePages.ts /path/to/public

# Med locales
tsx design/system/core/scripts/validatePages.ts /path/to/public sv,en,no
```

### I editor/dashboard (programmatiskt)

```typescript
// File validators
import { 
  validateRequiredDirectories,
  validateRequiredFiles,
  validatePageNames,
  validateContentFiles,
  validateFileNameConsistency,
  detectLocales
} from '@blimpify-im/ui/validators/page-files.validator';

// Content validators
import { 
  validateStructureFile,
  validateContentFile,
  validatePageContent
} from '@blimpify-im/ui/validators/page-content.validator';

// Schema och regler
import {
  AllowedSectionTypes,
  isValidSectionType,
  sectionMetadata
} from '@blimpify-im/ui/schemas/section.types';

// Använd individuella validators
const dirResult = validateRequiredDirectories('/path/to/public');
if (!dirResult.valid) {
  console.error('Directory errors:', dirResult.errors);
}

// Validera en enskild page
const pageResult = validatePageContent('/path/to/public', 'start', ['sv', 'en']);
if (!pageResult.valid) {
  console.error('Page errors:', pageResult.errors);
  console.warn('Page warnings:', pageResult.warnings);
}

// Kolla om section type är giltig
if (isValidSectionType('hero')) {
  const metadata = sectionMetadata['hero'];
  console.log(metadata.displayName); // "Hero Section"
}

// Eller kör full validering
import { validatePages } from '@blimpify-im/ui/scripts/validatePages';

const summary = await validatePages('/path/to/public');
console.log(`Validated ${summary.totalPages} pages`);
console.log(`Found ${summary.totalErrors} errors`);
console.log(`${summary.validPages} pages are valid`);
```

## Output

Scriptet ger färgad output i terminalen:

- ✅ Grön = Validering passerad
- ❌ Röd = Fel som måste fixas
- ⚠️ Gul = Varningar (bra att åtgärda)

### Exempel Output

```
🔍 Blimpify Page Validator
Validating: /Users/you/blimpify/blimpify-workspace/clients/template-26feb20/public

────────────────────────────────────────────────────────────

📁 Step 1: Directory Structure

✅ Required Directories

📄 Step 2: Required Files

✅ Required Files

🌍 Detected Locales: sv

🏷️  Step 3: Page Name Validation

✅ Page Names
  Found 1 page(s): start

🗂️  Step 4: Content File Structure

✅ Content Files

🔗 Step 5: File Name Consistency

✅ File Consistency

📋 Step 6: Page Content Validation
Validating section types, structure, and positioning rules...

✅ start (3 sections: hero, services, contact)

────────────────────────────────────────────────────────────

📊 Validation Summary
  Project: template-26feb20
  Pages validated: 1
  Pages valid: 1
  Pages invalid: 0
  Locales: sv
  ✅ Status: PASSED
  Errors: 0
  Warnings: 0
  Duration: 25ms
```

## Validerings-regler

### Page Names (slug)

- Måste vara lowercase
- Kan innehålla: bokstäver, siffror, bindestreck
- Längd: 2-50 tecken
- Får INTE börja eller sluta med bindestreck
- Får INTE använda reserverade namn: `blocked`, `maintenance`, `404`, `500`, `error`

### Section Content Rules

#### Tillåtna Section Types

Endast dessa 12 section types är tillåtna i pages:

- `hero` - Landing section med primary CTA
- `about` - Company eller product information
- `services` - Showcase av tjänster eller features
- `testimonials` - Kundrecensioner och testimonials
- `faq` - Frequently asked questions
- `pricing` - Prissättning och planer
- `cta` - Call to action (conversion-fokuserad)
- `logos` - Klient- eller partner-logos
- `stats` - Key metrics och siffror
- `team` - Team members showcase
- `process` - Steg-för-steg process eller timeline
- `contact` - Kontaktformulär och information

#### Section Occurrence Rules

**Max en av varje section type per page**

```json
// ❌ FEL - Duplicerad section type
{
  "sections": {
    "hero_abc123": { "type": "hero" },
    "hero_def456": { "type": "hero" }  // ❌ Hero finns redan
  }
}

// ✅ RÄTT - En av varje
{
  "sections": {
    "hero_abc123": { "type": "hero" },
    "services_def456": { "type": "services" }
  }
}
```

#### Section Positioning Rules

**Hero måste vara först**

Hero section MÅSTE vara den första sectionen i `order`-arrayen.

```json
// ❌ FEL - Hero inte först
{
  "sections": { "hero_abc": {}, "about_def": {} },
  "order": ["about_def", "hero_abc"]  // ❌ Hero måste vara först
}

// ✅ RÄTT
{
  "sections": { "hero_abc": {}, "about_def": {} },
  "order": ["hero_abc", "about_def"]  // ✅ Hero först
}
```

**Contact måste vara sist (om den finns)**

Om en Contact section finns, MÅSTE den vara sista sectionen i `order`-arrayen.

```json
// ❌ FEL - Contact inte sist
{
  "sections": { "hero_abc": {}, "contact_def": {}, "cta_ghi": {} },
  "order": ["hero_abc", "contact_def", "cta_ghi"]  // ❌ Contact måste vara sist
}

// ✅ RÄTT
{
  "sections": { "hero_abc": {}, "cta_ghi": {}, "contact_def": {} },
  "order": ["hero_abc", "cta_ghi", "contact_def"]  // ✅ Contact sist
}

// ✅ OCKSÅ OK - Ingen contact section
{
  "sections": { "hero_abc": {}, "cta_ghi": {} },
  "order": ["hero_abc", "cta_ghi"]  // ✅ Contact är optional
}
```

#### Pattern Structure Rules

**SectionHeader pattern krävs**

Varje section MÅSTE ha minst ett pattern med `type: "sectionHeader"` och det MÅSTE vara första patternet i sektionens `order`-array.

```json
// ❌ FEL - Ingen sectionHeader
{
  "hero_abc123": {
    "type": "hero",
    "patterns": {
      "action_def456": { "type": "action" }  // ❌ Ingen sectionHeader
    },
    "order": ["action_def456"]
  }
}

// ❌ FEL - SectionHeader inte först
{
  "hero_abc123": {
    "type": "hero",
    "patterns": {
      "action_def456": { "type": "action" },
      "sectionHeader_ghi789": { "type": "sectionHeader" }
    },
    "order": ["action_def456", "sectionHeader_ghi789"]  // ❌ SectionHeader måste vara först
  }
}

// ✅ RÄTT
{
  "hero_abc123": {
    "type": "hero",
    "patterns": {
      "sectionHeader_ghi789": { "type": "sectionHeader" },
      "action_def456": { "type": "action" }
    },
    "order": ["sectionHeader_ghi789", "action_def456"]  // ✅ SectionHeader först
  }
}
```

### SEO Requirements

Alla content-filer (`/content/[locale]/pages/*.json`) måste ha:

- **Title** - Obligatorisk, rekommenderat 30-60 tecken
- **Description** - Obligatorisk, rekommenderat 120-160 tecken

```json
{
  "seo": {
    "title": "Välkommen - Professionell Tjänst",        // ✅ 37 tecken
    "description": "Vi erbjuder högkvalitativa tjänster..." // ✅ 145 tecken
  }
}
```

### Required Structure

```
/public/
  ├── pages/
  │   └── start.json              ✅ Obligatorisk
  ├── content/
  │   └── [locale]/               ✅ Minst ett språk
  │       ├── pages/
  │       │   └── start.json      ✅ Obligatorisk
  │       └── shells/
  │           ├── navbar.json     ✅ Obligatorisk
  │           └── footer.json     ✅ Obligatorisk
  ├── shells/
  │   ├── navbar.json             ✅ Obligatorisk
  │   └── footer.json             ✅ Obligatorisk
  └── design/
      └── design.json             ✅ Obligatorisk
```

## Exit Codes

- `0` - Alla valideringar passerade
- `1` - Valideringsfel hittades

Detta gör det användbart i CI/CD pipelines.

## Återanvändbara Validators

Alla validator-funktioner finns i två filer:

### File Validators
```
blimpify-ui/design/system/core/validators/page-files.validator.ts
```

Funktioner:
- `validateRequiredDirectories()` - Kontrollerar mappar
- `validateRequiredFiles()` - Kontrollerar filer
- `validatePageNames()` - Validerar page-namn
- `validateContentFiles()` - Kontrollerar content-filer
- `validateFileNameConsistency()` - Kontrollerar konsistens
- `detectLocales()` - Hittar tillgängliga språk

### Content Validators
```
blimpify-ui/design/system/core/validators/page-content.validator.ts
```

Funktioner:
- `validateStructureFile()` - Validerar /pages/*.json struktur
- `validateContentFile()` - Validerar /content/[locale]/pages/*.json
- `validatePageContent()` - Validerar hela page med alla locales

### Schema Definitions
```
blimpify-ui/design/system/core/schemas/section.types.ts
```

Exports:
- `AllowedSectionTypes` - Array av tillåtna section types
- `isValidSectionType()` - Type guard för section types
- `SectionPositioningRules` - Positioneringsregler
- `SectionOccurrenceRules` - Förekomstregler
- `sectionMetadata` - Metadata för alla section types

Dessa är återanvändbara i:
- CLI scripts
- Editor/Dashboard (CMS)
- CI/CD pipelines
- Pre-commit hooks
- Custom validators

## Implementerat ✅

- ✅ Directory och file structure validation
- ✅ Page naming conventions
- ✅ Content file consistency
- ✅ Section type validation (12 tillåtna types)
- ✅ Section occurrence rules (max en av varje)
- ✅ Section positioning rules (hero först, contact sist)
- ✅ Pattern structure (sectionHeader required and must be first)
- ✅ JSON structure validation (sections, order, patterns)
- ✅ SEO field validation (title, description, optimal längd)
- ✅ Component structure validation

## Nästa steg (framtida förbättringar)

- Pattern type validation (validera pattern types inom sections)
- Component ID format validation (6-tecken ID pattern)
- Section key format validation (type_id123 pattern)
- Asset file validation (kontrollera att assets/bilder finns)
- Auto-fix för vissa fel (t.ex. sortera order array)
- Watch mode för kontinuerlig validering
- Integration med Editor/CMS för live validation
- Detailed validation reports (JSON/HTML export)
