# Logo Variant Guide

## Understanding Logo Variants

The `LogoImage` component supports 4 variants to handle different logo types and dark mode scenarios:

---

## 📋 Quick Reference

| Variant | Light Mode | Dark Mode | Best For |
|---------|-----------|-----------|----------|
| **`auto`** | Original | Inverted | Black logos on white BG |
| **`light`** | Original | Inverted | Black/dark logos |
| **`dark`** | Inverted | Original | White/light logos |
| **`color`** | Original | Original | Full-color logos |

---

## 🎨 Variant Details

### 1. **`auto`** (Default)
**When to use:** You have a black logo on a transparent or white background.

**Behavior:**
- Light mode: Shows logo as-is
- Dark mode: Inverts to white

**Example:**
```tsx
<LogoImage 
  src="/logo-black.png" 
  variant="auto"  // or omit, it's the default
  alt="Company Logo" 
/>
```

**Best for:**
- Standard black text logos
- Black icon logos
- Most common use case

---

### 2. **`light`**
**When to use:** You have a logo designed for light backgrounds (black/dark colored).

**Behavior:**
- Light mode: Shows logo as-is (black/dark)
- Dark mode: Inverts to white/light

**Example:**
```tsx
<LogoImage 
  src="/logo-for-light-bg.png" 
  variant="light"
  alt="Company Logo" 
/>
```

**Best for:**
- Dark or black logos
- Logos with dark gray tones
- When you want explicit control over light background logos

**Same as `auto`?** Yes! This is just a more explicit way to declare intent.

---

### 3. **`dark`**
**When to use:** You have a WHITE logo designed for dark backgrounds.

**Behavior:**
- Light mode: Inverts to black (makes it visible on light background)
- Dark mode: Shows as-is (white)

**Example:**
```tsx
<LogoImage 
  src="/logo-white.png" 
  variant="dark"
  alt="Company Logo" 
/>
```

**Best for:**
- White logos
- Light-colored logos
- Logos extracted from dark backgrounds

**Real-world scenario:** You only have a white PNG version of your logo (common from dark-mode-first designs).

---

### 4. **`color`**
**When to use:** You have a full-color logo that should NEVER be inverted.

**Behavior:**
- Light mode: Shows logo as-is
- Dark mode: Shows logo as-is (NO inversion)

**Example:**
```tsx
<LogoImage 
  src="/logo-color.png" 
  variant="color"
  alt="Company Logo" 
/>
```

**Best for:**
- Multi-color brand logos
- Logos with specific brand colors (red, blue, etc.)
- Gradient logos
- Logos that must maintain brand identity in all themes

---

## 🎯 Decision Tree

```
Do you have a logo to add?
│
├─ Is it FULL COLOR (multiple colors/gradients)?
│  └─ YES → Use variant="color"
│
├─ Is it WHITE or LIGHT COLORED?
│  └─ YES → Use variant="dark"
│
└─ Is it BLACK or DARK COLORED?
   └─ YES → Use variant="auto" or variant="light"
```

---

## 💡 Common Scenarios

### Scenario 1: Black logo only
```tsx
<LogoImage 
  src="/logo-black.png" 
  variant="auto"
  alt="Logo" 
/>
```
✅ Works perfectly in both themes

---

### Scenario 2: White logo only
```tsx
<LogoImage 
  src="/logo-white.png" 
  variant="dark"
  alt="Logo" 
/>
```
✅ Inverts to black in light mode, shows white in dark mode

---

### Scenario 3: Full-color brand logo
```tsx
<LogoImage 
  src="/logo-color.png" 
  variant="color"
  alt="Logo" 
/>
```
✅ Never inverts, maintains brand colors

---

### Scenario 4: Multiple logo files (ideal)
```tsx
// Light mode logo
<LogoImage 
  src="/logo-light.png" 
  variant="light"
  alt="Logo" 
/>

// OR provide both and swap based on theme
{theme === 'dark' ? (
  <LogoImage src="/logo-white.png" variant="color" alt="Logo" />
) : (
  <LogoImage src="/logo-black.png" variant="color" alt="Logo" />
)}
```
✅ Best practice when you have multiple versions

---

## ⚠️ Common Mistakes

### ❌ Wrong: Using auto with a white logo
```tsx
// White logo will be invisible in light mode!
<LogoImage src="/logo-white.png" variant="auto" />
```

### ✅ Correct: Use dark variant
```tsx
<LogoImage src="/logo-white.png" variant="dark" />
```

---

### ❌ Wrong: Using color variant with black logo expecting inversion
```tsx
// Won't invert in dark mode - will be invisible!
<LogoImage src="/logo-black.png" variant="color" />
```

### ✅ Correct: Use auto or light variant
```tsx
<LogoImage src="/logo-black.png" variant="auto" />
```

---

## 🔧 Technical Notes

**How inversion works:**
- Uses CSS `filter: invert(1)` 
- Flips colors: black ↔ white, dark ↔ light
- Does NOT affect hue (good for grayscale, bad for color)

**Why color logos shouldn't be inverted:**
- Red becomes cyan
- Blue becomes yellow
- Destroys brand identity

**Performance:**
- All variants have same performance
- No JavaScript color detection needed
- Pure CSS solution

---

## 📝 JSON Configuration Examples

### For your navbar config:

#### Black logo:
```json
"logo_fjVaWmY": {
  "type": "logo",
  "props": {
    "src": "/logos/logo-black.png",
    "alt": "Company Logo",
    "variant": "auto"
  }
}
```

#### White logo:
```json
"logo_fjVaWmY": {
  "type": "logo",
  "props": {
    "src": "/logos/logo-white.png",
    "alt": "Company Logo",
    "variant": "dark"
  }
}
```

#### Color logo:
```json
"logo_fjVaWmY": {
  "type": "logo",
  "props": {
    "src": "/logos/logo-color.png",
    "alt": "Company Logo",
    "variant": "color"
  }
}
```

---

## 🎨 Your Current Setup

Based on your config:
```json
"logo_fjVaWmY": {
  "type": "logo",
  "props": {
    "src": "/2194716412/images/logos/kjlogo.png",
    "alt": "Logo"
  }
}
```

**Recommendation:**
1. Check what color your `kjlogo.png` is
2. Add the appropriate variant:
   - Black logo → `"variant": "auto"` (or omit)
   - White logo → `"variant": "dark"`
   - Color logo → `"variant": "color"`

**Example:**
```json
"logo_fjVaWmY": {
  "type": "logo",
  "props": {
    "src": "/2194716412/images/logos/kjlogo.png",
    "alt": "Logo",
    "variant": "auto"  // ← Add this based on your logo
  }
}
```