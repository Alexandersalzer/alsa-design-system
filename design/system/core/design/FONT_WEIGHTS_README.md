# Dynamic Font Weight System

This design system now supports **dynamic font weight selection** that adapts to the available weights of any Google Font. Users can select specific weights for headings, body text, and labels based on what the chosen font actually supports.

---

## Overview

### Problem Solved
Previously, font weights were limited to predefined tiers (regular, medium, semibold, bold, extrabold) regardless of what weights the selected font actually supported. This meant:
- Some fonts didn't have all the tier weights available
- Users couldn't access lighter weights like 100, 200, 300
- The system couldn't adapt to each font's unique weight offerings

### Solution
The new system:
1. **Fetches available weights** from Google Fonts API for any selected font
2. **Filters weights intelligently** (lighter weights for body, heavier for headings)
3. **Validates hierarchy** (ensures headings are always bolder than body text)
4. **Auto-calculates label weight** (sits between body and heading)
5. **Supports the full 100-900 range** that Google Fonts offers

---

## How It Works

### 1. Google Fonts API Integration

The system queries Google Fonts API to discover available weights:

```typescript
import { getFontMetadata } from '@blimpify-im/ui/design/system/core/design/googleFontsUtils';

// Fetch available weights for a font
const metadata = await getFontMetadata('Inter');
console.log(metadata.availableWeights); // [100, 200, 300, 400, 500, 600, 700, 800, 900]
```

### 2. Smart Weight Filtering

Weights are filtered based on their purpose:

- **Body text**: 300-500 (lighter weights for readability)
- **Headings**: 600-900 (heavier weights for emphasis)
- **Labels**: 400-700 (medium weights for UI elements)

```typescript
import {
  getBodyWeightOptions,
  getHeadingWeightOptions,
  getLabelWeightOptions
} from '@blimpify-im/ui/design/system/core/design/googleFontsUtils';

const bodyOptions = getBodyWeightOptions([100, 300, 400, 500, 700, 900]);
// Returns: [300, 400, 500]

const headingOptions = getHeadingWeightOptions([100, 300, 400, 500, 700, 900]);
// Returns: [700, 900]
```

### 3. Weight Hierarchy Validation

The system ensures headings are always bolder than body text:

```typescript
import { validateWeightHierarchy } from '@blimpify-im/ui/design/system/core/design/googleFontsUtils';

const validation = validateWeightHierarchy(700, 400);
console.log(validation); // { isValid: true }

const invalid = validateWeightHierarchy(400, 700);
console.log(invalid); // { isValid: false, message: "Heading weight (400) must be greater than body weight (700)" }
```

### 4. Auto-Calculated Label Weight

Label weight is automatically calculated as the midpoint between body and heading:

```typescript
import { calculateLabelWeight } from '@blimpify-im/ui/design/system/core/design/googleFontsUtils';

const labelWeight = calculateLabelWeight(700, 400, [400, 500, 600, 700]);
console.log(labelWeight); // 500 (midpoint between 400 and 700)
```

---

## Usage in Components

### FontWeightPicker Component

Use this component to let users select weights for a specific font:

```tsx
import { FontWeightPicker } from '@/components/editor/ThemeControlPanel/FontWeightPicker';

<FontWeightPicker
  fontFamily="Inter"
  label="Heading Weight"
  value={700}
  onChange={(weight) => console.log('Selected weight:', weight)}
  type="heading" // 'body' | 'heading' | 'label'
  size="sm"
  otherWeight={400} // Body weight for validation
/>
```

### FontWeightPickerGroup Component

Use this group component to manage all three weights together:

```tsx
import { FontWeightPickerGroup } from '@/components/editor/ThemeControlPanel/FontWeightPicker';

<FontWeightPickerGroup
  fontFamily="Inter"
  headingWeight={700}
  bodyWeight={400}
  labelWeight={500}
  onHeadingWeightChange={(weight) => console.log('Heading:', weight)}
  onBodyWeightChange={(weight) => console.log('Body:', weight)}
  onLabelWeightChange={(weight) => console.log('Label:', weight)}
  size="sm"
/>
```

**Key Features:**
- ✅ Automatically fetches available weights from Google Fonts
- ✅ Filters weights by type (body/heading/label)
- ✅ Validates weight hierarchy
- ✅ Auto-calculates label weight
- ✅ Shows loading state while fetching
- ✅ Handles errors gracefully

---

## Design Tokens

### Token Structure

The system uses numeric weight values (100-900) instead of named tiers:

```json
{
  "globalStyles": {
    "fontPrimary": "Inter",
    "fontSecondary": "Sora",
    "fontWeightHeadingNumeric": 700,
    "fontWeightBodyNumeric": 400,
    "fontWeightLabelNumeric": 500
  }
}
```

### CSS Variable Output

These tokens are converted to CSS variables:

```css
:root {
  --selected-font-weight-heading: 700;
  --selected-font-weight-body: 400;
  --selected-font-weight-label: 500;
}
```

### Applied to Typography

Typography components automatically use these weights:

```css
h1, h2, h3 {
  font-weight: var(--font-heading-weight); /* Uses --selected-font-weight-heading */
}

p, .text-body {
  font-weight: var(--font-body-weight); /* Uses --selected-font-weight-body */
}

label, .text-label {
  font-weight: var(--font-label-weight); /* Uses --selected-font-weight-label */
}
```

---

## API Reference

### Core Utilities

#### `getFontMetadata(fontFamily: string)`
Fetches font metadata from Google Fonts API.

**Returns:**
```typescript
{
  family: string;
  availableWeights: number[]; // e.g., [300, 400, 500, 700]
  category: string; // 'sans-serif' | 'serif' | 'display' | 'monospace'
}
```

#### `getBodyWeightOptions(weights: number[])`
Filters weights suitable for body text (300-500).

#### `getHeadingWeightOptions(weights: number[])`
Filters weights suitable for headings (600-900).

#### `getLabelWeightOptions(weights: number[])`
Filters weights suitable for labels (400-700).

#### `validateWeightHierarchy(heading: number, body: number)`
Validates that heading weight > body weight.

**Returns:**
```typescript
{
  isValid: boolean;
  message?: string;
}
```

#### `calculateLabelWeight(heading: number, body: number, available: number[])`
Auto-calculates optimal label weight between body and heading.

#### `getWeightLabel(weight: number)`
Converts numeric weight to user-friendly label.

**Examples:**
- `getWeightLabel(400)` → "Regular (400)"
- `getWeightLabel(700)` → "Bold (700)"
- `getWeightLabel(800)` → "Extra Bold (800)"

---

## Migration Guide

### From Legacy Tier System

**Old System (Deprecated):**
```json
{
  "fontWeightScale": "regular" // Limited to: light, regular, strong, extraStrong
}
```

**New System:**
```json
{
  "fontWeightHeadingNumeric": 700,
  "fontWeightBodyNumeric": 400,
  "fontWeightLabelNumeric": 500
}
```

### Automatic Migration

The system automatically handles migration:
1. If numeric weights are provided, they take priority
2. If only legacy tiers exist, they're converted to numeric values
3. Safe defaults are applied if nothing is provided

---

## Examples

### Example 1: Lightweight Font (Inter)

**Available weights:** 100, 200, 300, 400, 500, 600, 700, 800, 900

**Recommended settings:**
- Body: 400 (Regular)
- Heading: 700 (Bold)
- Label: 500 (Medium) - auto-calculated

### Example 2: Display Font (Playfair Display)

**Available weights:** 400, 500, 600, 700, 800, 900

**Recommended settings:**
- Body: 400 (Regular)
- Heading: 700 (Bold)
- Label: 500 (Medium) - auto-calculated

### Example 3: Monospace Font (JetBrains Mono)

**Available weights:** 100, 200, 300, 400, 500, 600, 700, 800

**Recommended settings:**
- Body: 400 (Regular)
- Heading: 700 (Bold)
- Label: 500 (Medium) - auto-calculated

---

## Performance Considerations

### Caching
Font metadata is cached in memory to avoid repeated API calls:

```typescript
// First call fetches from API
const meta1 = await getFontMetadata('Inter'); // API call

// Second call uses cache
const meta2 = await getFontMetadata('Inter'); // Cached
```

### Preloading
Preload common fonts on app initialization:

```typescript
import { preloadCommonFonts } from '@blimpify-im/ui/design/system/core/design/googleFontsUtils';

// In your app initialization
await preloadCommonFonts(); // Preloads Inter, Sora, Poppins, etc.
```

### Error Handling
Falls back to standard weights if API fails:

```typescript
// If API fails, returns safe fallback
const metadata = await getFontMetadata('CustomFont');
// Returns: { availableWeights: [300, 400, 500, 600, 700, 800] }
```

---

## Troubleshooting

### Font weights not updating
**Issue:** Selected weight doesn't appear in preview
**Solution:** Ensure the font is loaded with the selected weight in the Google Fonts URL

### Validation errors
**Issue:** "Heading weight must be greater than body weight"
**Solution:** Choose a heavier weight for headings (minimum 600 recommended)

### Missing weights
**Issue:** Some expected weights aren't showing
**Solution:** Check Google Fonts - not all fonts support all weights

### API failures
**Issue:** "Failed to load font weights"
**Solution:** Check network connection. System will fall back to standard weights automatically.

---

## Best Practices

### 1. **Maintain Hierarchy**
Always ensure headings are bolder than body text:
- ✅ Body: 400, Heading: 700
- ❌ Body: 700, Heading: 400

### 2. **Limit Weight Jumps**
Avoid extreme differences for visual harmony:
- ✅ Body: 400, Heading: 700 (300 difference)
- ⚠️ Body: 300, Heading: 900 (600 difference - too jarring)

### 3. **Consider Readability**
Body text weights:
- ✅ 400 (Regular) - Most readable
- ✅ 300 (Light) - For large sizes only
- ❌ 700 (Bold) - Too heavy for long-form text

### 4. **Test Across Devices**
Lighter weights (100-300) may render poorly on low-DPI screens.

### 5. **Use Auto-Calculated Labels**
Let the system calculate label weights for optimal balance.

---

## Future Enhancements

Potential future improvements:
- Support for variable fonts (continuous weight range)
- Optical size adjustments
- Font weight recommendations based on font category
- A/B testing different weight combinations
- Accessibility-focused weight validation

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API reference
3. Inspect browser console for detailed error messages
4. Check that Google Fonts API is accessible

---

**Last Updated:** December 2025
**Version:** 1.0.0
