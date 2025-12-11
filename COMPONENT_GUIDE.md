# Component Usage Guide - Final Rules

**Last Updated:** 2025-01-20

## 🎯 The 4 Components (And Only 4!)

| Component | Use For | Layout | Example |
|-----------|---------|--------|---------|
| **`SelectionCard`** | Clickable cards in grids/selection UIs | Vertical or Horizontal | Theme picker, Page selector, Integration selector |
| **`ListboxItem`** | Horizontal list items | Horizontal with leading/trailing | Domain list, Notifications, Settings rows |
| **`Card`** | Static display only (NO clicking) | Any | Dashboard stats, Info displays |
| **`Clickable`** | Low-level escape hatch (RARE) | Any | Custom one-off interactions |

---

## ✅ SelectionCard - Grid/Card Selection

**Use when:**
- User needs to select from options displayed as cards
- Items are in a grid layout (2+ columns)
- Visual/spatial selection interface
- Content flows vertically (icon above text) OR horizontally

### Examples:

```tsx
// Page selector (vertical)
<Grid columns={3} gap="md">
  <SelectionCard
    selected={isSelected}
    onChange={() => toggle()}
    orientation="vertical"
    indicator="none"
  >
    <VStack spacing="sm" align="center">
      <Icon size="lg"><HomeIcon /></Icon>
      <H4>Landing Page</H4>
      <Body size="sm">Main entry point</Body>
    </VStack>
  </SelectionCard>
</Grid>

// Domain modal options (horizontal)
<VStack spacing="md">
  <SelectionCard
    onClick={() => selectExisting()}
    orientation="horizontal"
    size="lg"
    indicator="none"
  >
    <HStack spacing="md" align="center">
      <Icon size="lg"><ServerIcon /></Icon>
      <VStack spacing="xs" align="start">
        <H4>Connect Existing Domain</H4>
        <Body size="sm">Link a domain you already own</Body>
      </VStack>
    </HStack>
  </SelectionCard>
</VStack>

// Color picker
<Grid columns={6} gap="sm">
  <SelectionCard
    selected={color === 'blue'}
    onClick={() => setColor('blue')}
    size="sm"
    indicator="none"
  >
    <VStack spacing="xs" align="center">
      <div style={{ width: 40, height: 40, background: 'blue', borderRadius: '50%' }} />
      <Body size="xs">Ocean</Body>
    </VStack>
  </SelectionCard>
</Grid>
```

### Props:

```tsx
interface SelectionCardProps {
  selected?: boolean;              // Visual selected state
  onChange?: (selected: boolean) => void;  // Callback
  onClick?: () => void;             // Simple click handler
  disabled?: boolean;               // Disable interaction
  indicator?: 'none' | 'checkbox' | 'radio';  // Show selection indicator
  orientation?: 'vertical' | 'horizontal';    // Content layout
  size?: 'sm' | 'md' | 'lg';       // Size variant
  children: ReactNode;              // Flexible content
}
```

---

## ✅ ListboxItem - List Rows

**Use when:**
- Vertical list of items (one per row)
- Items have leading icon/avatar and/or trailing action/chevron
- Content flows horizontally (icon → text → action)
- Examples: Domain list, Notifications, Settings options

### Examples:

```tsx
// Domain list
<List variant="divided">
  <ListboxItem
    onClick={() => navigate(`/domains/${id}`)}
    leading={<Icon><ServerIcon /></Icon>}
    trailing={<Icon><ChevronRightIcon /></Icon>}
  >
    <VStack spacing="xs">
      <H4>example.com</H4>
      <Body size="sm" color="secondary">Ready to activate</Body>
    </VStack>
  </ListboxItem>
</List>

// Notification list
<List variant="divided">
  <ListboxItem
    onClick={() => markAsRead(id)}
    leading={<Icon><BellIcon /></Icon>}
    selected={isUnread}
  >
    <VStack spacing="xs">
      <Body weight="medium">{title}</Body>
      <Body size="sm" color="secondary">{message}</Body>
    </VStack>
  </ListboxItem>
</List>

// With card variant (for emphasized lists)
<List variant="divided">
  <ListboxItem
    variant="card"
    selected={isActive}
    onClick={() => select()}
    leading={<Avatar />}
  >
    <Body>{name}</Body>
  </ListboxItem>
</List>
```

### Props:

```tsx
interface ListboxItemProps {
  leading?: ReactNode;              // Icon/avatar before content
  trailing?: ReactNode;             // Action/chevron after content
  selected?: boolean;               // Selected state
  onClick?: () => void;             // Click handler
  disabled?: boolean;               // Disable interaction
  variant?: 'default' | 'card';     // Visual variant
  size?: 'sm' | 'md' | 'lg';       // Size
  children: ReactNode;              // Main content
}
```

---

## ✅ Card - Static Display Only

**Use when:**
- Displaying information (NO clicking)
- Dashboard widgets
- Status displays
- Content containers

### Examples:

```tsx
// Dashboard stat card (NO INTERACTION)
<Card>
  <CardContent>
    <VStack spacing="md">
      <Icon size="lg"><ChartBarIcon /></Icon>
      <Label>Visits This Week</Label>
      <H2>1,234</H2>
      <Body size="sm" color="secondary">↑ 12% from last week</Body>
    </VStack>
  </CardContent>
</Card>

// Info display
<Card variant="outlined">
  <CardHeader>
    <H4>Subscription Status</H4>
  </CardHeader>
  <CardContent>
    <Body>Your plan: Pro</Body>
    <Body size="sm">Renews: Jan 20, 2025</Body>
  </CardContent>
</Card>
```

**❌ NEVER use `Card` with `interactive` prop or `onClick`!** Use `SelectionCard` or `ListboxItem` instead.

---

## ✅ Clickable - Escape Hatch

**Use when:**
- Building a truly custom interactive element
- None of the above fit your use case
- You need full control over layout/behavior

**⚠️ Think twice before using!** 99% of the time, you should use `SelectionCard` or `ListboxItem`.

---

## 📋 Decision Tree

```
Need an interactive element?
├─ Is it in a grid of cards?
│  └─ YES → Use SelectionCard
│
├─ Is it a row in a vertical list?
│  └─ YES → Use ListboxItem
│
├─ Does it just display info (no click)?
│  └─ YES → Use Card
│
└─ None of the above?
   └─ Use Clickable (rare)
```

---

## 🚫 Anti-Patterns (Don't Do This!)

```tsx
// ❌ BAD: Card with onClick
<Card onClick={...} style={{ cursor: 'pointer' }}>
  <CardContent>...</CardContent>
</Card>

// ✅ GOOD: SelectionCard
<SelectionCard onClick={...}>
  <VStack>...</VStack>
</SelectionCard>

// ❌ BAD: Clickable for grid cards
<Grid>
  <Clickable as="div" padding="lg" borderRadius="md" ...>
    <VStack>...</VStack>
  </Clickable>
</Grid>

// ✅ GOOD: SelectionCard
<Grid>
  <SelectionCard orientation="vertical">
    <VStack>...</VStack>
  </SelectionCard>
</Grid>

// ❌ BAD: SelectionCard for list rows
<SelectionCard orientation="horizontal">
  <HStack><Icon /> <Body>Item</Body> <Icon /></HStack>
</SelectionCard>

// ✅ GOOD: ListboxItem
<ListboxItem leading={<Icon />} trailing={<Icon />}>
  <Body>Item</Body>
</ListboxItem>
```

---

## 📦 Component Locations

- **SelectionCard**: `@blimpify-im/ui` → `design/system/components/actions/SelectionCard`
- **ListboxItem**: `@blimpify-im/ui` → `design/system/components/lists/Listbox/ListboxItem`
- **Card**: `@blimpify-im/ui` → `design/system/components/layout/Card`
- **Clickable**: `@blimpify-im/ui` → `design/system/components/actions/Clickable`

---

## 🎉 Migration Completed

All interactive card patterns have been migrated to use this unified system:

✅ PageSelector → SelectionCard
✅ SectionSelector → SelectionCard
✅ IntegrationSelector → SelectionCard
✅ Domain modal options → SelectionCard
✅ ColorGrid (DashboardThemePanel) → SelectionCard

**Result:** Consistent, maintainable, zero-ambiguity component usage! 🚀
