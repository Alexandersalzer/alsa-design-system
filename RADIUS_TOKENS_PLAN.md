# Radius Token Restructuring Plan

## Problem Summary

Your design system has **two conflicting radius token systems**:

1. **Dynamic Semantic Tokens** (✅ Working correctly)
   - Located in: `design/system/tokens/semantic/radius.css`
   - Tokens: `--radius-xs`, `--radius-sm`, `--radius-md`, `--radius-lg`, etc.
   - These respond to `--selected-radius-scale-*` which changes when you select a radius preset

2. **Hardcoded Component Tokens** (❌ Broken - not responding to radius selection)
   - Located in: `design/system/tokens/component/form.css` and `design/system/tokens/component/table.css`
   - Tokens like `--form-radius-base`, `--radius-checkbox`, `--radius-picker`, `--radius-dropdown`, `--radius-table`
   - These are hardcoded to foundation tokens (e.g., `--foundation-radius-lg`) and don't respond to your radius scale selection

## Current Issues

When you select "none" radius, these components still show border radius:

| Component | Current Token | Current Value | Issue |
|-----------|--------------|---------------|-------|
| Checkbox | `--radius-checkbox` | `--foundation-radius-md` (6px) | Hardcoded |
| Picker | `--radius-picker` | `--foundation-radius-lg` (8px) | Hardcoded |
| Dropdown/Popover | `--radius-dropdown` | `--foundation-radius-lg` (8px) | Hardcoded |
| AriaPopover | `--radius-dropdown` | `--foundation-radius-lg` (8px) | Hardcoded |
| Table | `--radius-table` | `--foundation-radius-lg` (8px) | Hardcoded |
| Tag | `--radius-tag` | Uses semantic `--radius-xs` | ✅ Correct |
| Button | `--radius-button` | Uses semantic `--radius-sm` | ✅ Correct |
| Calendar buttons | Uses `--radius-button` | Semantic | ✅ Correct |
| Menu items | Uses `--radius-button` | Semantic | ✅ Correct |
| Clickable | Uses semantic tokens directly | Semantic | ✅ Correct |

## Token Hierarchy (Proposed)

```
Foundation Tokens (Base scales - Never use directly in components)
    ↓
Semantic Tokens (Dynamic - Respond to radius scale selection)
    ↓
Component Tokens (Point to semantic tokens)
    ↓
Component CSS (Uses component tokens)
```

## Proposed Token Structure

### 1. Semantic Radius Tokens (Already exists - no changes needed)

**File**: `design/system/tokens/semantic/radius.css`

```css
:root {
  /* These already exist and work correctly */
  --radius-none: var(--selected-radius-scale-none);
  --radius-xs: var(--selected-radius-scale-xs);
  --radius-sm: var(--selected-radius-scale-sm);
  --radius-md: var(--selected-radius-scale-md);
  --radius-lg: var(--selected-radius-scale-lg);
  --radius-xl: var(--selected-radius-scale-xl);
  --radius-2xl: var(--selected-radius-scale-2xl);
  --radius-full: var(--selected-radius-scale-full);
}
```

### 2. Component Radius Tokens (Needs restructuring)

**File**: `design/system/tokens/component/form.css`

**BEFORE** (Hardcoded):
```css
--form-radius-base: var(--foundation-radius-lg);     /* ❌ Hardcoded */
--form-radius-small: var(--foundation-radius-md);    /* ❌ Hardcoded */
--form-radius-large: var(--foundation-radius-xl);    /* ❌ Hardcoded */
--form-radius-round: var(--foundation-radius-full);  /* ❌ Hardcoded */

--radius-checkbox: var(--form-radius-small);         /* ❌ Points to hardcoded */
--radius-picker: var(--form-radius-base);            /* ❌ Points to hardcoded */
--radius-dropdown: var(--form-radius-base);          /* ❌ Points to hardcoded */
```

**AFTER** (Dynamic):
```css
/* Remove --form-radius-* tokens entirely - they're not needed */

/* Form component radius tokens - pointing to semantic tokens */
--radius-checkbox-sm: var(--radius-xs);
--radius-checkbox: var(--radius-sm);
--radius-checkbox-lg: var(--radius-md);

--radius-picker-sm: var(--radius-xs);
--radius-picker: var(--radius-sm);
--radius-picker-lg: var(--radius-md);

--radius-dropdown-sm: var(--radius-xs);
--radius-dropdown: var(--radius-sm);
--radius-dropdown-lg: var(--radius-md);

--radius-radio: var(--radius-full);  /* Always circular */
--radius-switch-track: var(--radius-full);  /* Always pill-shaped */
--radius-switch-thumb: var(--radius-full);  /* Always circular */
```

**File**: `design/system/tokens/component/layout.css`

The component/layout.css file already has the right structure, but we need to ensure all tokens use semantic tokens:

```css
/* LEVEL 1: CONTAINER COMPONENTS (Outer shells) */
--radius-card-sm: var(--radius-sm);
--radius-card: var(--radius-md);
--radius-card-lg: var(--radius-lg);
--radius-modal: var(--radius-xl);
--radius-sheet: var(--radius-lg);
--radius-popover: var(--radius-md);
--radius-section: var(--radius-md);
--radius-panel: var(--radius-lg);

/* LEVEL 2: FORM COMPONENTS */
--radius-button-sm: var(--radius-xs);
--radius-button: var(--radius-sm);
--radius-button-lg: var(--radius-md);

--radius-input-sm: var(--radius-xs);
--radius-input: var(--radius-sm);
--radius-input-lg: var(--radius-md);

/* Already exists, matches button */
--radius-picker-sm: var(--radius-xs);
--radius-picker: var(--radius-sm);
--radius-picker-lg: var(--radius-md);

--radius-dropdown-sm: var(--radius-xs);
--radius-dropdown: var(--radius-sm);
--radius-dropdown-lg: var(--radius-md);

/* LEVEL 3: NESTED COMPONENTS */
--radius-badge: var(--radius-sm);
--radius-tag: var(--radius-xs);
--radius-chip: var(--radius-sm);
--radius-avatar-sm: var(--radius-xs);
--radius-avatar: var(--radius-sm);
--radius-icon-button: var(--radius-xs);

/* SPECIALIZED COMPONENTS */
--radius-toast: var(--radius-md);
--radius-alert: var(--radius-sm);
--radius-tab: var(--radius-sm);
--radius-table-cell: var(--radius-xs);
```

**File**: `design/system/tokens/component/table.css`

**BEFORE**:
```css
--radius-table: var(--foundation-radius-lg);  /* ❌ Hardcoded */
```

**AFTER**:
```css
--radius-table: var(--radius-md);  /* ✅ Dynamic */
```

## Implementation Steps

### Step 1: Update form.css
**File**: `design/system/tokens/component/form.css`

1. Remove these tokens entirely (lines 191-194):
   - `--form-radius-base`
   - `--form-radius-small`
   - `--form-radius-large`
   - `--form-radius-round`

2. Update form component radius tokens (lines 196-202):
   ```css
   /* Checkbox - three size variants */
   --radius-checkbox-sm: var(--radius-xs);
   --radius-checkbox: var(--radius-sm);
   --radius-checkbox-lg: var(--radius-md);

   /* Radio - always circular */
   --radius-radio: var(--radius-full);

   /* Switch - always pill/circular */
   --radius-switch-track: var(--radius-full);
   --radius-switch-thumb: var(--radius-full);

   /* Picker - moved to layout.css for consistency with button/input */
   /* Dropdown - moved to layout.css for consistency */
   ```

### Step 2: Update table.css
**File**: `design/system/tokens/component/table.css`

Update line 41:
```css
--radius-table: var(--radius-md);
```

### Step 3: Verify layout.css
**File**: `design/system/tokens/component/layout.css`

Verify these tokens already use semantic tokens (they should already be correct based on your file):
- `--radius-picker`, `--radius-picker-sm`, `--radius-picker-lg`
- `--radius-dropdown`, `--radius-dropdown-sm`, `--radius-dropdown-lg`
- All other component radius tokens

### Step 4: Update component CSS files (if needed)

Most component CSS files should already be using the component tokens correctly. However, verify these files use the right token:

- ✅ **Picker.css** - Uses `--radius-picker` (correct)
- ✅ **Menu.css** - Uses `--radius-button` (correct)
- ✅ **Popover.css** - Uses `--radius-dropdown` (correct)
- ✅ **AriaPopover.css** - Uses `--radius-dropdown` (correct)
- ✅ **Checkbox.css** - Uses `--radius-checkbox` (correct)
- ✅ **Calendar.css** - Uses `--radius-button` (correct)
- ✅ **Table.css** - Uses `--radius-table` (correct)
- ✅ **Tag.css** - Uses `--radius-tag` (correct)
- ✅ **Clickable.css** - Uses semantic tokens directly (correct)

## Testing Plan

After implementation, test with each radius scale:

1. **None** - All components should have 0 border radius (except radio/switch which should remain circular)
2. **XS** - All components should have minimal radius
3. **SM** - All components should have small radius
4. **MD** - All components should have medium radius (default)
5. **LG** - All components should have large radius
6. **XL** - All components should have extra large radius
7. **2XL** - All components should have very large radius
8. **Full** - All components should have maximum radius (but not circular like radio/switch)

### Components to Verify:
- [ ] Buttons (all sizes)
- [ ] Inputs (all sizes)
- [ ] Pickers (all sizes)
- [ ] Dropdowns/Menus (all sizes)
- [ ] Popovers/AriaPopovers
- [ ] Checkboxes (all sizes) - should respond to scale
- [ ] Radio buttons - should always be circular
- [ ] Switches - should always be pill-shaped
- [ ] Calendar date buttons
- [ ] Tables
- [ ] Tags
- [ ] Cards
- [ ] Modals
- [ ] Clickable elements

## Key Principles

1. **Never use foundation tokens directly in components** - Always go through semantic tokens
2. **Semantic tokens are the source of truth** - They respond to the radius scale selection
3. **Component tokens provide semantic meaning** - They make it clear what radius is for what purpose
4. **Some components should ignore the scale** - Radio buttons and switches should always be circular/pill-shaped
5. **Consistency across similar components** - Buttons, inputs, pickers, and dropdowns should all use the same radius values

## Files to Modify

1. ✅ `design/system/tokens/component/form.css` - Update radius tokens
2. ✅ `design/system/tokens/component/table.css` - Update radius token
3. ✅ `design/system/tokens/component/layout.css` - Verify (should already be correct)

## Files That Should NOT Need Changes

All component CSS files should already be using the correct token hierarchy:
- `design/system/components/forms/Picker/Picker.css`
- `design/system/components/overlays/Menu/Menu.css`
- `design/system/components/overlays/Popover/Popover.css`
- `design/system/components/overlays/AriaPopover/AriaPopover.css`
- `design/system/components/forms/Checkbox/Checkbox.css`
- `design/system/components/forms/Calendar/Calendar.css`
- `design/system/components/data/Table/Table.css`
- `design/system/components/feedback/Tag/Tag.css`
- All other component CSS files

---

## Summary

The fix is simple: **Remove the hardcoded form radius tokens and make all component radius tokens reference semantic tokens instead of foundation tokens directly.**

This will ensure that when you select a radius scale (like "none"), all components respond correctly except for components that should always maintain their shape (radio buttons, switches).
