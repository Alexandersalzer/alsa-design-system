# Navigation Components Examples

## Breadcrumbs

### Basic Usage

```tsx
import { Breadcrumbs, BreadcrumbItem } from '@blimpify-ui/design-system';

// Default variant (solid)
<Breadcrumbs>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/products">Products</BreadcrumbItem>
  <BreadcrumbItem href="/products/electronics">Electronics</BreadcrumbItem>
  <BreadcrumbItem isCurrent>Laptop</BreadcrumbItem>
</Breadcrumbs>
```

### Variants

```tsx
// Bordered variant - pill buttons with borders
<Breadcrumbs variant="bordered">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
  <BreadcrumbItem isCurrent>Components</BreadcrumbItem>
</Breadcrumbs>

// Light variant - minimal styling
<Breadcrumbs variant="light">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/settings">Settings</BreadcrumbItem>
  <BreadcrumbItem isCurrent>Profile</BreadcrumbItem>
</Breadcrumbs>
```

### Color Variants

```tsx
// Accent color (uses your brand color from semantic tokens)
<Breadcrumbs color="accent">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
  <BreadcrumbItem isCurrent>Analytics</BreadcrumbItem>
</Breadcrumbs>

// Primary (same as accent)
<Breadcrumbs color="primary">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem isCurrent>About</BreadcrumbItem>
</Breadcrumbs>

// Secondary (muted colors)
<Breadcrumbs color="secondary">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem isCurrent>Help</BreadcrumbItem>
</Breadcrumbs>
```

### Sizes

```tsx
// Small
<Breadcrumbs size="sm">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem isCurrent>Page</BreadcrumbItem>
</Breadcrumbs>

// Medium (default)
<Breadcrumbs size="md">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem isCurrent>Page</BreadcrumbItem>
</Breadcrumbs>

// Large
<Breadcrumbs size="lg">
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem isCurrent>Page</BreadcrumbItem>
</Breadcrumbs>
```

### Custom Styling (HeroUI-style)

```tsx
// Pill buttons with custom styling
<Breadcrumbs
  variant="bordered"
  classNames={{
    list: "gap-2",
  }}
  itemClasses={{
    item: [
      "data-[current=true]:bg-surface-accent",
      "data-[current=true]:text-text-on-accent",
      "data-[current=true]:border-border-accent",
    ],
    separator: "hidden",
  }}
  size="sm"
>
  <BreadcrumbItem href="/" isCurrent={currentPage === 'home'}>
    Home
  </BreadcrumbItem>
  <BreadcrumbItem href="/music" isCurrent={currentPage === 'music'}>
    Music
  </BreadcrumbItem>
  <BreadcrumbItem href="/artist" isCurrent={currentPage === 'artist'}>
    Artist
  </BreadcrumbItem>
</Breadcrumbs>
```

## BackButton

### Basic Usage

```tsx
import { BackButton } from '@blimpify-ui/design-system';

// Default ghost variant
<BackButton onClick={() => router.back()}>
  Back
</BackButton>

// Custom text
<BackButton onClick={() => router.back()}>
  Go Back
</BackButton>
```

### Variants

```tsx
// Ghost (default) - transparent with hover
<BackButton variant="ghost">Back</BackButton>

// Subtle - subtle background
<BackButton variant="subtle">Back</BackButton>

// Bordered - with border
<BackButton variant="bordered">Back</BackButton>
```

### Sizes

```tsx
<BackButton size="sm">Back</BackButton>
<BackButton size="md">Back</BackButton>
<BackButton size="lg">Back</BackButton>
```

### Without Icon

```tsx
<BackButton showIcon={false}>Back</BackButton>
```

## Breadcrumbs + BackButton Pattern

### Side by Side Layout

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <BackButton onClick={() => router.back()} />

  <Breadcrumbs color="accent" variant="light">
    <BreadcrumbItem href="/">Home</BreadcrumbItem>
    <BreadcrumbItem href="/products">Products</BreadcrumbItem>
    <BreadcrumbItem isCurrent>Details</BreadcrumbItem>
  </Breadcrumbs>
</div>
```

### Stacked Layout (Mobile-friendly)

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
  <BackButton size="sm" />

  <Breadcrumbs size="sm" variant="light">
    <BreadcrumbItem href="/">Home</BreadcrumbItem>
    <BreadcrumbItem href="/products">Products</BreadcrumbItem>
    <BreadcrumbItem isCurrent>Details</BreadcrumbItem>
  </Breadcrumbs>
</div>
```

### Stripe-Style (Minimal with Accent)

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
  <BackButton variant="ghost" size="sm" />

  <Breadcrumbs
    color="accent"
    variant="light"
    size="sm"
    hideSeparator={false}
  >
    <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
    <BreadcrumbItem isCurrent>Settings</BreadcrumbItem>
  </Breadcrumbs>
</div>
```

## Recommendations

### When to use what:

1. **Breadcrumbs + BackButton** - Use for deep navigation hierarchies where users might arrive from different paths
2. **Breadcrumbs only** - Use for consistent hierarchical navigation (e.g., e-commerce categories)
3. **BackButton only** - Use for simple linear flows (e.g., checkout, onboarding)

### Styling tips:

- **Accent color** works great for dashboards and internal tools (Stripe-style)
- **Bordered variant** works well for document-style interfaces
- **Light variant** is best for minimal, content-focused layouts
- **Solid variant** provides the most visual prominence

### Accessibility:

- BackButton has proper ARIA labels
- Breadcrumbs use semantic `<nav>` and `aria-current="page"`
- Current breadcrumb items are properly marked and non-interactive
