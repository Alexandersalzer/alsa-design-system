# Interactive List Item Migration Guide

## TL;DR - The Solution

**✅ Use `ListboxItem` for ALL interactive list items**

Stop using:
- ❌ Custom `Clickable` styles for lists
- ❌ Interactive `Card` components
- ❌ Custom wrappers with inline styles

## Why This Matters

**Problem:** Team members were creating custom clickable cards with inconsistent styles because there was no clear "go-to" component for interactive list items.

**Solution:** `ListboxItem` is now the single source of truth. It has everything you need built-in.

## Quick Reference

```tsx
// ✅ CORRECT - Use ListboxItem
<ListboxItem
  onClick={() => navigate()}
  leading={<Icon><ServerIcon /></Icon>}
  trailing={<Icon><ChevronRightIcon /></Icon>}
>
  <VStack spacing="xs">
    <H4>example.com</H4>
    <Body size="sm" color="secondary">Ready to activate</Body>
  </VStack>
</ListboxItem>

// ❌ WRONG - Don't use Clickable for list items
<Clickable
  as="li"
  padding="lg"
  borderRadius="md"
  background="transparent"
  onClick={() => navigate()}
>
  {/* ... */}
</Clickable>

// ❌ WRONG - Don't use interactive Card
<Card interactive onCardClick={() => navigate()}>
  {/* ... */}
</Card>
```

## Component Comparison

| Component | Use For | Don't Use For |
|-----------|---------|---------------|
| **ListboxItem** | ✅ All interactive lists (domains, notifications, selections) | ❌ Non-list content (use Card) |
| **Card** | ✅ Visual containers, dashboard cards, static content | ❌ Interactive lists (use ListboxItem) |
| **Clickable** | ✅ Low-level custom interactions (edge cases only) | ❌ List items (use ListboxItem) |

## Migration Examples

### Example 1: Domain List

**Before (using Clickable):**
```tsx
<List variant="divided" spacing="none">
  {domains.map((domain) => (
    <Clickable
      key={domain.id}
      as="li"
      padding="lg"
      paddingBlock="md"
      borderRadius="md"
      background="transparent"
      border="none"
      onClick={() => handleManageDomain(domain.id)}
    >
      <HStack spacing="lg" justify="between">
        <VStack spacing="xs">
          <H4>{domain.domain_name}</H4>
          <Body size="sm" color="secondary">Status info</Body>
        </VStack>
        <Icon><ChevronRightIcon /></Icon>
      </HStack>
    </Clickable>
  ))}
</List>
```

**After (using ListboxItem):**
```tsx
<List variant="divided" spacing="none">
  {domains.map((domain) => (
    <ListboxItem
      key={domain.id}
      onClick={() => handleManageDomain(domain.id)}
      trailing={<Icon><ChevronRightIcon /></Icon>}
    >
      <VStack spacing="xs">
        <H4>{domain.domain_name}</H4>
        <Body size="sm" color="secondary">Status info</Body>
      </VStack>
    </ListboxItem>
  ))}
</List>
```

### Example 2: Page Selector (Grid Layout)

**Before (using Card):**
```tsx
<Grid columns={{ base: 1, md: 2 }} gap="md">
  {pages.map((page) => (
    <Card
      key={page.id}
      variant="outlined"
      interactive
      selected={selectedPages.includes(page.id)}
      onCardClick={() => togglePage(page.id)}
    >
      <CardContent>
        <VStack spacing="sm">
          <H4>{page.name}</H4>
          <Body size="sm">{page.description}</Body>
        </VStack>
      </CardContent>
    </Card>
  ))}
</Grid>
```

**After (using ListboxItem with card variant):**
```tsx
<Grid columns={{ base: 1, md: 2 }} gap="md">
  {pages.map((page) => (
    <ListboxItem
      key={page.id}
      variant="card"
      selected={selectedPages.includes(page.id)}
      onClick={() => togglePage(page.id)}
      role="listitem"
    >
      <VStack spacing="sm">
        <H4>{page.name}</H4>
        <Body size="sm">{page.description}</Body>
      </VStack>
    </ListboxItem>
  ))}
</Grid>
```

### Example 3: Notification List

**Before (custom wrapper):**
```tsx
<div
  style={{
    padding: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
    ':hover': { backgroundColor: 'var(--surface-hover)' }
  }}
  onClick={() => handleRead(notification.id)}
>
  <HStack spacing="md">
    <Icon><BellIcon /></Icon>
    <VStack>
      <Body weight="medium">{notification.title}</Body>
      <Body size="sm" color="secondary">{notification.message}</Body>
    </VStack>
  </HStack>
</div>
```

**After (using ListboxItem):**
```tsx
<ListboxItem
  onClick={() => handleRead(notification.id)}
  leading={<Icon><BellIcon /></Icon>}
  role="listitem"
>
  <VStack spacing="xs">
    <Body weight="medium">{notification.title}</Body>
    <Body size="sm" color="secondary">{notification.message}</Body>
  </VStack>
</ListboxItem>
```

## Props Reference

### ListboxItem Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Main content |
| `onClick` | function | - | Click handler |
| `leading` | ReactNode | - | Content before main (icon, avatar) |
| `trailing` | ReactNode | - | Content after main (chevron, button) |
| `variant` | `'default'` \| `'card'` | `'default'` | Visual style |
| `size` | `'sm'` \| `'md'` \| `'lg'` | `'md'` | Size variant |
| `selected` | boolean | `false` | Selected state |
| `disabled` | boolean | `false` | Disabled state |
| `interactive` | boolean | `true` | Enable interactions |
| `role` | string | `'option'` | ARIA role |

### Variant Guide

- **`default`**: Flat, transparent background
  - Use for: Standard lists, navigation lists, settings lists
  - Hover: Subtle background change

- **`card`**: Subtle border + elevated background
  - Use for: Grid layouts, selectable cards, featured items
  - Hover: Border becomes more visible

## When to Use Each Component

### Use `ListboxItem` when:
- ✅ Displaying a list of clickable items
- ✅ Building navigation menus
- ✅ Creating selection interfaces (pages, sections, options)
- ✅ Showing notification/news feeds
- ✅ Domain/resource management lists

### Use `Card` when:
- ✅ Displaying static content (no click action)
- ✅ Creating dashboard widgets
- ✅ Showing summary information
- ✅ Building layouts that need visual separation

### Use `Clickable` when:
- ✅ You need a truly custom interactive element
- ✅ Building one-off components
- ✅ None of the above fit your use case

## Benefits of This Approach

1. **Consistency** - Everyone uses the same component with the same styles
2. **Accessibility** - Built-in ARIA roles, keyboard navigation, focus states
3. **Less Code** - No more custom padding/border/radius props
4. **Maintainability** - One place to update styles
5. **Clarity** - Clear naming makes intent obvious

## Action Items for Team

1. **New code**: Always use `ListboxItem` for interactive lists
2. **Refactoring**: Gradually migrate existing code when touching those files
3. **Code review**: Point teammates to this guide if they use Clickable/Card for lists
4. **Questions**: If unsure, default to `ListboxItem` - it's probably right

## FAQ

**Q: Can I still use `Clickable`?**
A: Yes, but only for truly custom interactions that don't fit list patterns.

**Q: What about interactive cards that aren't in lists?**
A: If it's genuinely not a list item, use `Card`. But most "card grids" are actually lists semantically.

**Q: Do I need to wrap `ListboxItem` in a `<List>`?**
A: Yes! For proper semantics and styling. Use `<List variant="divided">` for most cases.

**Q: Can I add custom buttons inside `ListboxItem`?**
A: Yes! Put them in the `trailing` prop. The component handles event bubbling correctly.

## Examples in Codebase

Check these files for reference implementations:
- ✅ `/im-dashboard/src/app/dashboard/client/domains/page.tsx` (after migration)
- ✅ `/im-dashboard/src/components/builder/PageSelector.tsx` (after migration)

---

**Remember: When in doubt, use `ListboxItem` for clickable lists. It's the single source of truth.**
