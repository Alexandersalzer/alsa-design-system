# Surface Level Guide for Navigation Components

## Problem Solved

When a sidebar has a background color (e.g., `surface-elevated` / neutral-100), the navigation item hover and active states need to be visually elevated **above** that background. Without contextual tokens, the hover/active colors would be the same as the sidebar background, making them invisible.

## Solution: `surfaceLevel` Prop

The `DashboardSidebar` component now accepts a `surfaceLevel` prop that automatically adjusts nav item hover and active colors based on the sidebar's background surface level.

## Usage

```tsx
import { DashboardSidebar } from '@/components/layouts/DashboardSidebar';

// Default: elevated background (neutral-100)
<DashboardSidebar
  navItems={items}
  isActive={isActive}
  user={user}
/>

// Explicit: page level (white background)
<DashboardSidebar
  navItems={items}
  isActive={isActive}
  user={user}
  surfaceLevel="page"
/>

// Explicit: elevated level (light gray background)
<DashboardSidebar
  navItems={items}
  isActive={isActive}
  user={user}
  surfaceLevel="elevated"
/>

// Explicit: sunken level (medium gray background)
<DashboardSidebar
  navItems={items}
  isActive={isActive}
  user={user}
  surfaceLevel="sunken"
/>
```

## How It Works

### Token Hierarchy

The solution uses **contextual CSS custom properties** that cascade based on the `data-surface-level` attribute:

| Surface Level | Sidebar BG | Nav Hover | Nav Active |
|--------------|------------|-----------|------------|
| `page` (default) | `neutral-0` (white) | `neutral-100` | `neutral-100` |
| `elevated` | `neutral-100` (light gray) | `neutral-200` | `neutral-200` |
| `sunken` | `neutral-200` (medium gray) | `neutral-300` | `neutral-300` |

### Architecture

1. **Component Level** ([DashboardSidebar.tsx](../../../im-dashboard/src/components/layouts/DashboardSidebar/DashboardSidebar.tsx))
   - Accepts `surfaceLevel` prop
   - Applies `data-surface-level={surfaceLevel}` to root `<Box>` element

2. **Token Level** ([navigation.css](./navigation.css))
   - Defines base navigation tokens (default = `page` level)
   - Provides `[data-surface-level="elevated"]` overrides
   - Provides `[data-surface-level="sunken"]` overrides

3. **Component CSS** ([Nav.css](../components/actions/Nav/Nav.css))
   - Uses `--surface-nav-item-hover` and `--surface-nav-item-selected` tokens
   - Automatically adapts based on the data attribute

## Design Token Reference

All tokens defined in [navigation.css](./navigation.css):

```css
/* Base (page level) */
--surface-nav-item-hover: var(--surface-hover);     /* neutral-100 */
--surface-nav-item-selected: var(--surface-elevated); /* neutral-100 */

/* Elevated level override */
[data-surface-level="elevated"] {
  --surface-nav-item-hover: var(--surface-sunken);    /* neutral-200 */
  --surface-nav-item-selected: var(--surface-sunken); /* neutral-200 */
}

/* Sunken level override */
[data-surface-level="sunken"] {
  --surface-nav-item-hover: var(--surface-deep);      /* neutral-300 */
  --surface-nav-item-selected: var(--surface-deep);   /* neutral-300 */
}
```

## Benefits

✅ **Scalable**: Easy to add more surface levels if needed
✅ **Reusable**: Pattern can be applied to other components (modals, popovers, etc.)
✅ **Maintainable**: All logic centralized in design tokens
✅ **Type-safe**: TypeScript enforces valid `surfaceLevel` values
✅ **Automatic**: Works with your existing accent intensity system

## Extending to Other Components

This pattern can be reused for any component that needs contextual color adjustments:

```tsx
// Modal on elevated surface
<Modal surfaceLevel="elevated">
  {/* Nav items inside will auto-adjust */}
</Modal>

// Popover on sunken surface
<Popover surfaceLevel="sunken">
  {/* Nav items inside will auto-adjust */}
</Popover>
```

Just apply the `data-surface-level` attribute and the tokens cascade automatically.
