# Page Validation Scripts

Dokumentation för page validation scripts i Blimpify.

## Översikt

Detta system validerar att alla pages-filer och content-filer följer Blimpify:s struktur-regler.

### Vad valideras?

1. **Directory Structure** - Kontrollerar att alla nödvändiga mappar finns
2. **Required Files** - Kontrollerar att obligatoriska filer finns (navbar, footer, start, design)
3. **Page Names** - Validerar att page-namn följer namnkonventioner
4. **Content Files** - Kontrollerar att alla pages har motsvarande content-filer för alla språk
5. **File Consistency** - Hittar "föräldralösa" content-filer utan struktur-fil

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
import { 
  validateRequiredDirectories,
  validateRequiredFiles,
  validatePageNames,
  validateContentFiles,
  validateFileNameConsistency,
  detectLocales
} from '@blimpify-im/ui/validators/page-files.validator';

// Använd individuella validators
const dirResult = validateRequiredDirectories('/path/to/public');
if (!dirResult.valid) {
  console.error('Directory errors:', dirResult.errors);
}

// Eller kör full validering
import { validatePages } from '@blimpify-im/ui/scripts/validatePages';

const summary = await validatePages('/path/to/public');
console.log(`Found ${summary.totalErrors} errors`);
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

────────────────────────────────────────────────────────────

📊 Validation Summary
  Project: template-26feb20
  Pages found: 1
  Locales: sv
  ✅ Status: PASSED
  Errors: 0
  Warnings: 0
  Duration: 15ms
```

## Validerings-regler

### Page Names (slug)

- Måste vara lowercase
- Kan innehålla: bokstäver, siffror, bindestreck
- Längd: 2-50 tecken
- Får INTE börja eller sluta med bindestreck
- Får INTE använda reserverade namn: `blocked`, `maintenance`, `404`, `500`, `error`

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

Alla validator-funktioner finns i:
```
blimpify-ui/design/system/core/validators/page-files.validator.ts
```

Detta gör dem återanvändbara i:
- CLI scripts
- Editor/Dashboard
- CI/CD pipelines
- Pre-commit hooks
- Custom validators

## Nästa steg

Planerade tillägg:
- Validering av JSON-innehåll (SEO, komponenter)
- Validering av section-struktur
- Validering av component-IDs
- Auto-fix för vissa fel
- Watch mode för kontinuerlig validering
