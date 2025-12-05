# Blimpify Design System Rules

**CRITICAL RULEBOOK - MUST BE FOLLOWED AT ALL TIMES**

This document defines the non-negotiable rules for working with the Blimpify Design System. Violations of these rules are unacceptable and must be corrected immediately.

---

## 1. COLOR TOKEN USAGE

### ✅ RULE: Use ONLY Semantic Tokens

**Components MUST use semantic tokens from Section 3 of `design/system/tokens/semantic/colors.css`**

```css
/* ✅ CORRECT */
.my-component {
  background-color: var(--surface-accent);
  color: var(--text-on-accent);
  border: 1px solid var(--border-accent);
}

/* ❌ WRONG - Never use foundation tokens directly */
.my-component {
  background-color: var(--foundation-accent-600);
  color: var(--foundation-white);
}

/* ❌ WRONG - Never use primitive scales directly */
.my-component {
  background-color: var(--accent-600);
  color: var(--neutral-0);
}
```

### ✅ RULE: NO Fallback Values

**NEVER use fallback values in `var()` functions. The design system provides all necessary tokens.**

```css
/* ✅ CORRECT */
.tooltip {
  background-color: var(--surface-inverse);
  color: var(--text-inverse);
}

/* ❌ WRONG - NO fallbacks allowed */
.tooltip {
  background-color: var(--surface-tooltip, var(--gray-900));
  color: var(--text-tooltip, var(--white));
}

/* ❌ WRONG - NO hardcoded colors */
.tooltip {
  background-color: #1f2937;
  color: #ffffff;
}
```

**Why?** Fallback values indicate missing tokens in the design system. If a token doesn't exist, it must be added to the semantic token system, not worked around with fallbacks.

### ✅ RULE: NO Non-Existent Tokens

**Do not invent token names. Only use tokens that exist in `semantic/colors.css`**

**Non-existent tokens (examples of what NOT to use):**
- `--surface-tooltip` ❌
- `--text-tooltip` ❌
- `--accent-solid` ❌
- `--success-solid` ❌
- `--warning-solid` ❌
- `--danger-solid` ❌
- `--error-solid` ❌

**Use these instead:**
- `--surface-inverse` for dark tooltip backgrounds ✅
- `--text-inverse` for light text on dark backgrounds ✅
- `--surface-accent` for accent backgrounds ✅
- `--surface-success` for success backgrounds ✅
- `--surface-warning` for warning backgrounds ✅
- `--surface-error` for error/danger backgrounds ✅
- `--text-on-accent`, `--text-on-success`, `--text-on-warning`, `--text-on-error` for text on colored backgrounds ✅

---

## 2. AVAILABLE SEMANTIC TOKEN CATEGORIES

### 3.1 Neutral (Layout & General UI)

**Surfaces:**
- `--surface-page`, `--surface-page-alt`
- `--surface-base`, `--surface-raised`, `--surface-elevated`
- `--surface-sunken`, `--surface-deep`
- `--surface-hover`, `--surface-active`, `--surface-selected`, `--surface-pressed`, `--surface-disabled`

**Text:**
- `--text-default`, `--text-strong`, `--text-muted`, `--text-subtle`, `--text-disabled`, `--text-placeholder`

**Borders:**
- `--border-default`, `--border-subtle`, `--border-strong`, `--border-emphasis`
- `--border-hover`, `--border-active`, `--border-disabled`

**Icons:**
- `--icon-default`, `--icon-strong`, `--icon-muted`, `--icon-subtle`, `--icon-disabled`

### 3.2 Inverse (High Contrast)

- `--surface-inverse`, `--surface-inverse-hover`, `--surface-inverse-active`
- `--text-inverse`, `--text-inverse-muted`
- `--border-inverse`
- `--icon-inverse`

### 3.3 Overlays

- `--surface-backdrop`
- `--surface-scrim`
- `--surface-overlay`

### 3.4 Accent (Primary Brand Color)

**Surfaces:**
- `--surface-accent`, `--surface-accent-subtle`, `--surface-accent-muted`

**Text:**
- `--text-accent`, `--text-accent-strong`, `--text-accent-subtle`, `--text-on-accent`

**Borders:**
- `--border-accent`, `--border-accent-subtle`, `--border-accent-strong`
- `--border-focus`, `--border-selected`

**Icons:**
- `--icon-accent`, `--icon-on-accent`

**Links:**
- `--text-link`, `--text-link-hover`

**Interactive:**
- `--interactive-accent`, `--interactive-accent-hover`, `--interactive-accent-active`, `--interactive-accent-disabled`

### 3.5 Error (Destructive, Validation)

**Surfaces:**
- `--surface-error`, `--surface-error-subtle`, `--surface-error-muted`

**Text:**
- `--text-error`, `--text-error-strong`, `--text-error-subtle`, `--text-on-error`

**Borders:**
- `--border-error`, `--border-error-subtle`, `--border-error-strong`

**Icons:**
- `--icon-error`, `--icon-on-error`

**Interactive:**
- `--interactive-destructive`, `--interactive-destructive-hover`, `--interactive-destructive-active`, `--interactive-destructive-disabled`

### 3.6 Success (Positive Feedback)

**Surfaces:**
- `--surface-success`, `--surface-success-subtle`, `--surface-success-muted`

**Text:**
- `--text-success`, `--text-success-strong`, `--text-success-subtle`, `--text-on-success`

**Borders:**
- `--border-success`, `--border-success-subtle`, `--border-success-strong`

**Icons:**
- `--icon-success`, `--icon-on-success`

**Interactive:**
- `--interactive-success`, `--interactive-success-hover`, `--interactive-success-active`, `--interactive-success-disabled`

### 3.7 Warning (Caution)

**Surfaces:**
- `--surface-warning`, `--surface-warning-subtle`, `--surface-warning-muted`

**Text:**
- `--text-warning`, `--text-warning-strong`, `--text-on-warning`

**Borders:**
- `--border-warning`, `--border-warning-subtle`

**Icons:**
- `--icon-warning`, `--icon-on-warning`

**Interactive:**
- `--interactive-warning`, `--interactive-warning-hover`, `--interactive-warning-active`, `--interactive-warning-disabled`

**Note:** Warning uses dark text on solid backgrounds (yellow background requires dark text for contrast).

### 3.8 Info (Informational)

**Surfaces:**
- `--surface-info`, `--surface-info-subtle`, `--surface-info-muted`

**Text:**
- `--text-info`, `--text-info-strong`, `--text-info-subtle`, `--text-on-info`

**Borders:**
- `--border-info`, `--border-info-subtle`

**Icons:**
- `--icon-info`, `--icon-on-info`

### 3.9 Interactive (Primary/Secondary/Tertiary Buttons)

**Primary:**
- `--interactive-primary`, `--interactive-primary-hover`, `--interactive-primary-active`, `--interactive-primary-disabled`

**Secondary:**
- `--interactive-secondary`, `--interactive-secondary-hover`, `--interactive-secondary-active`, `--interactive-secondary-disabled`

**Tertiary:**
- `--interactive-tertiary`, `--interactive-tertiary-hover`, `--interactive-tertiary-active`

### 3.10 Shadows

- `--shadow-subtle`
- `--shadow-default`
- `--shadow-emphasis`
- `--shadow-strong`
- `--shadow-extra-strong`

### 3.11 Intent Tokens (Auto-Adaptive)

**Actions:**
- `--intent-action-primary`, `--intent-action-primary-hover`, `--intent-action-primary-active`, `--intent-action-primary-disabled`
- `--intent-action-secondary`, `--intent-action-secondary-hover`, `--intent-action-secondary-active`, `--intent-action-secondary-disabled`

**Navigation:**
- `--intent-nav-item-active-bg`, `--intent-nav-item-active-text`, `--intent-nav-item-active-icon`, `--intent-nav-item-active-border`

**Links:**
- `--intent-link`, `--intent-link-hover`

**Focus:**
- `--intent-focus-ring`, `--intent-focus-bg`

**Badges/Tags:**
- `--intent-badge-bg`, `--intent-badge-text`, `--intent-badge-border`

**Icons:**
- `--intent-icon-accent`

**Text on Intent Backgrounds:**
- `--intent-text-on-action`, `--intent-icon-on-action`

---

## 3. LEGACY ALIASES

### ⚠️ DEPRECATED - Migrate Away From These

The following tokens exist for backward compatibility but should NOT be used in new code:

**Old Text Naming:**
- `--text-primary` → Use `--text-default` instead
- `--text-secondary` → Use `--text-muted` instead
- `--text-tertiary` → Use `--text-subtle` instead

**Old Icon Naming:**
- `--icon-primary` → Use `--icon-strong` instead
- `--icon-secondary` → Use `--icon-default` instead
- `--icon-tertiary` → Use `--icon-muted` instead

---

## 4. DARK MODE HANDLING

### ✅ RULE: NO Manual Dark Mode Overrides

**Semantic tokens automatically adapt to light/dark mode. Do NOT add manual dark mode overrides.**

```css
/* ✅ CORRECT - Tokens adapt automatically */
.component {
  background-color: var(--surface-accent);
  color: var(--text-on-accent);
}

/* ❌ WRONG - NO manual dark mode CSS */
[data-theme="dark"] .component {
  background-color: var(--surface-accent);
  color: var(--text-on-accent);
}
```

**Why?** The semantic token system uses `--is-dark` and `color-mix()` to automatically invert colors. Manual overrides create inconsistencies and defeat the purpose of the token system.

---

## 5. COMPONENT COLOR VARIANT PATTERN

### ✅ RULE: Follow This Pattern for Color Variants

When creating components with color variants (default, primary, success, warning, danger/error), follow this pattern:

```css
/* Default variant - uses inverse for maximum contrast */
.component--default {
  background-color: var(--surface-inverse);
  color: var(--text-inverse);
  border-color: var(--border-inverse);
}

/* Primary variant - uses accent color */
.component--primary {
  background-color: var(--surface-accent);
  color: var(--text-on-accent);
  border-color: var(--border-accent);
}

/* Success variant */
.component--success {
  background-color: var(--surface-success);
  color: var(--text-on-success);
  border-color: var(--border-success);
}

/* Warning variant */
.component--warning {
  background-color: var(--surface-warning);
  color: var(--text-on-warning);
  border-color: var(--border-warning);
}

/* Danger/Error variant */
.component--danger {
  background-color: var(--surface-error);
  color: var(--text-on-error);
  border-color: var(--border-error);
}

/* Secondary variant - uses subtle neutral */
.component--secondary {
  background-color: var(--surface-raised);
  color: var(--text-default);
  border-color: var(--border-default);
}
```

---

## 6. CHECKING YOUR WORK

### Before Committing Code, Verify:

1. ✅ All `var()` calls reference tokens from `semantic/colors.css` Section 3
2. ✅ NO fallback values in any `var()` call
3. ✅ NO hardcoded color values (`#ffffff`, `rgb()`, etc.)
4. ✅ NO invented token names that don't exist in the design system
5. ✅ NO manual dark mode overrides (unless truly exceptional case)
6. ✅ Color variants follow the standard pattern above

### How to Verify Tokens Exist:

```bash
# Search for a token in the semantic colors file
grep "your-token-name" design/system/tokens/semantic/colors.css
```

If the token doesn't exist in Section 3 (lines 244-763), DO NOT USE IT.

---

## 7. WHEN TO ADD NEW TOKENS

### ✅ RULE: Only Add Tokens When Absolutely Necessary

**Before adding a new semantic token, ask:**

1. Can I use an existing semantic token instead?
2. Is this truly a new semantic purpose, or can it map to existing tokens?
3. Will this token be used in multiple components, or is it component-specific?

**If you must add a new token:**

1. Add it to Section 3 of `semantic/colors.css`
2. Group it by status/purpose (Neutral, Accent, Error, Success, Warning, Info)
3. Create all necessary variants:
   - Surface (base, subtle, muted)
   - Text (default, strong, subtle, on-[color])
   - Border (default, subtle, strong)
   - Icon (default, on-[color])
4. Document it in this rulebook
5. Get approval before committing

---

## 8. VIOLATION CONSEQUENCES

### What Happens When These Rules Are Broken:

1. **Immediate Fix Required** - Code with violations must be corrected before merging
2. **No Fallbacks to Production** - Code with fallback values will be rejected
3. **Token Cleanup** - Invented tokens must be replaced with proper semantic tokens
4. **Dark Mode Fixes** - Manual dark mode overrides must be removed

---

## 9. EXAMPLES OF COMMON MISTAKES

### ❌ Mistake #1: Using Fallback Values

```css
/* WRONG */
.tooltip {
  background-color: var(--surface-tooltip, var(--gray-900));
  color: var(--text-tooltip, var(--white));
}

/* CORRECT */
.tooltip {
  background-color: var(--surface-inverse);
  color: var(--text-inverse);
}
```

### ❌ Mistake #2: Inventing Token Names

```css
/* WRONG */
.button {
  background-color: var(--accent-solid);
  color: var(--text-white);
}

/* CORRECT */
.button {
  background-color: var(--surface-accent);
  color: var(--text-on-accent);
}
```

### ❌ Mistake #3: Using Foundation Tokens Directly

```css
/* WRONG */
.card {
  background-color: var(--foundation-gray-50);
  color: var(--foundation-gray-900);
  border: 1px solid var(--foundation-gray-200);
}

/* CORRECT */
.card {
  background-color: var(--surface-raised);
  color: var(--text-default);
  border: 1px solid var(--border-default);
}
```

### ❌ Mistake #4: Manual Dark Mode Overrides

```css
/* WRONG */
.component {
  background-color: var(--surface-accent);
}

[data-theme="dark"] .component {
  background-color: var(--surface-accent-dark);
}

/* CORRECT - No dark mode override needed */
.component {
  background-color: var(--surface-accent);
}
```

---

## 10. QUICK REFERENCE

### Most Common Token Pairs:

| Use Case | Background | Text |
|----------|------------|------|
| Tooltip (dark) | `--surface-inverse` | `--text-inverse` |
| Card/Panel | `--surface-raised` | `--text-default` |
| Button (accent) | `--surface-accent` | `--text-on-accent` |
| Button (neutral) | `--surface-raised` | `--text-default` |
| Error Alert | `--surface-error-subtle` | `--text-error` |
| Success Alert | `--surface-success-subtle` | `--text-success` |
| Warning Alert | `--surface-warning-subtle` | `--text-warning` |
| Solid Error Button | `--surface-error` | `--text-on-error` |
| Solid Success Button | `--surface-success` | `--text-on-success` |

---

## SUMMARY

**The Three Golden Rules:**

1. ✅ **Use ONLY semantic tokens from Section 3 of `semantic/colors.css`**
2. ✅ **NEVER use fallback values in `var()` functions**
3. ✅ **NEVER invent token names that don't exist in the design system**

---

**Last Updated:** 2025-12-05
**Version:** 1.0
**Maintainer:** Design System Team
