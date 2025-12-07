# Font Weight Tier System

## Overview

The Blimpify design system uses a **tier-based font weight system** (400-800 range) that ensures headings are always bolder than body text with automatic validation.

## Tier Options

### Body Text Weights (Lighter)
| Tier | Value | Description |
|------|-------|-------------|
| `regular` | 400 | Standard body text weight |
| `medium` | 500 | Slightly emphasized body text |

### Heading Weights (Bolder)
| Tier | Value | Description |
|------|-------|-------------|
| `semibold` | 600 | Subtle, refined headings |
| `bold` | 700 | Strong, clear headings (default) |
| `extrabold` | 800 | Maximum impact headings |

## Rules & Validation

### 1. Strict Hierarchy
**Heading weight must ALWAYS be greater than body weight**

```typescript
// ✅ Valid combinations
{ fontWeightHeading: "bold", fontWeightBody: "regular" }      // 700 > 400
{ fontWeightHeading: "extrabold", fontWeightBody: "medium" }  // 800 > 500
{ fontWeightHeading: "semibold", fontWeightBody: "regular" }  // 600 > 400

// ❌ Invalid - will fallback to defaults
{ fontWeightHeading: "semibold", fontWeightBody: "semibold" } // 600 = 600
{ fontWeightHeading: "bold", fontWeightBody: "extrabold" }    // 700 < 800
```

### 2. Limited Range (400-800)
- **No ultra-light** (300) - too faint for most UIs
- **No ultra-black** (900) - too heavy, lacks refinement
- **Sweet spot**: Professional, readable, versatile

### 3. Auto-calculated Label Weight
Label weight is automatically calculated to sit between body and heading:

```typescript
// Example: heading=700, body=400
// → label automatically becomes 500 (medium)

calculateLabelWeight("bold", "regular") // Returns "medium"
```

## Usage in design.json

```json
{
  "globalStyles": {
    "fontPrimary": "Outfit",
    "fontSecondary": "Outfit",
    "fontWeightHeading": "bold",      // Options: semibold | bold | extrabold
    "fontWeightBody": "regular"       // Options: regular | medium
  }
}
```

## Valid Combinations Matrix

| Body Weight | Compatible Heading Weights |
|-------------|---------------------------|
| **regular (400)** | semibold, bold, extrabold |
| **medium (500)** | semibold, bold, extrabold |

## Programmatic Usage

### Validate Weights
```typescript
import { validateWeightHierarchy } from '@blimpify-im/ui/design/system/core/design';

const isValid = validateWeightHierarchy("bold", "regular");
// Returns: true (700 > 400)
```

### Get Valid Options
```typescript
import { getValidHeadingOptions } from '@blimpify-im/ui/design/system/core/design';

const options = getValidHeadingOptions("regular");
// Returns: ["semibold", "bold", "extrabold"]
```

### Auto-normalize with Fallbacks
```typescript
import { normalizeWeights } from '@blimpify-im/ui/design/system/core/design';

const weights = normalizeWeights("bold", "regular");
// Returns: {
//   heading: "bold",      // 700
//   body: "regular",      // 400
//   label: "medium",      // 500 (auto-calculated)
//   isValid: true
// }

// Invalid input gets safe defaults
const fallback = normalizeWeights("semibold", "bold");
// Returns defaults + warning:
// {
//   heading: "bold",      // 700
//   body: "regular",      // 400
//   label: "medium",      // 500
//   isValid: false
// }
```

### Get Numeric Values
```typescript
import { getWeightValue, WEIGHT_TIER_MAP } from '@blimpify-im/ui/design/system/core/design';

getWeightValue("bold")      // Returns: 700
getWeightValue("regular")   // Returns: 400

// Or use the map directly
WEIGHT_TIER_MAP["extrabold"] // Returns: 800
```

## CSS Output

The tier system generates direct numeric CSS variables:

```css
:root {
  /* Generated from design.json */
  --selected-font-weight-heading: 700;  /* From "bold" */
  --selected-font-weight-body: 400;     /* From "regular" */
  --selected-font-weight-label: 500;    /* Auto-calculated */
}
```

These are used by semantic typography tokens:

```css
h1, h2, h3 {
  font-weight: var(--selected-font-weight-heading); /* 700 */
}

p, .text-body {
  font-weight: var(--selected-font-weight-body); /* 400 */
}

label, .text-label {
  font-weight: var(--selected-font-weight-label); /* 500 */
}
```

## Migration from Old System

### Before (Scale-based)
```json
{
  "fontWeightScale": "strong"  // Abstract scale
}
```

### After (Tier-based)
```json
{
  "fontWeightHeading": "extrabold",  // Explicit, clear
  "fontWeightBody": "regular"        // Direct control
}
```

## Benefits

✅ **Clear intent** - No abstract "scales", just explicit weights
✅ **Automatic validation** - Invalid combos get safe defaults
✅ **Label auto-calculation** - One less decision to make
✅ **Limited range** - Professional 400-800 sweet spot
✅ **Type-safe** - Full TypeScript support
✅ **Universal compatibility** - Works with any font

## TypeScript Types

```typescript
type BodyWeightTier = "regular" | "medium";
type HeadingWeightTier = "semibold" | "bold" | "extrabold";
type WeightTier = BodyWeightTier | HeadingWeightTier;

interface DesignTokens {
  fontWeightHeading?: HeadingWeightTier;
  fontWeightBody?: BodyWeightTier;
  // ... other tokens
}
```

## Examples

### Light & Clean (SaaS)
```json
{
  "fontWeightHeading": "semibold",   // 600
  "fontWeightBody": "regular"        // 400
}
```

### Balanced (Default)
```json
{
  "fontWeightHeading": "bold",       // 700
  "fontWeightBody": "regular"        // 400
}
```

### Bold & Impactful (Marketing)
```json
{
  "fontWeightHeading": "extrabold",  // 800
  "fontWeightBody": "regular"        // 400
}
```

### Maximum Contrast
```json
{
  "fontWeightHeading": "extrabold",  // 800
  "fontWeightBody": "medium"         // 500
}
```

## FAQ

**Q: What if my font doesn't have all weights?**
A: Google Fonts automatically loads 400-800 for all fonts. If a specific weight isn't available, browsers will synthesize it or use the nearest available weight.

**Q: Can I use 300 or 900?**
A: No. The system enforces 400-800 for optimal readability and professional appearance.

**Q: What happens if I provide invalid weights?**
A: The system logs a warning and falls back to safe defaults: heading=700, body=400, label=500.

**Q: Can I override label weight?**
A: Not directly in design.json - it's auto-calculated. You can override specific components using CSS or component props.

**Q: Why not just use numeric weights?**
A: Named tiers provide clear intent, enable validation, and create a constrained system that prevents design inconsistency.
