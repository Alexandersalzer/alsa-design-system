# StickyNavContent Pattern

A pattern for displaying content with a sticky navigation sidebar. Perfect for step-by-step processes, documentation, or multi-section content.

## Features

- **Sticky Navigation**: Sidebar stays visible while scrolling
- **Two Navigation Variants**: List or Accordion
- **Two Content Layouts**: Stack (vertical) or Grid
- **Auto-scroll**: Clicking nav items scrolls to content
- **Active State**: Highlights current section
- **Responsive**: Mobile-friendly collapse

## JSON Structure

```json
{
  "type": "stickyNavContent",
  "props": {
    "navVariant": "list",        // "list" | "accordion"
    "contentLayout": "stack",     // "stack" | "grid"
    "gridColumns": 1,             // Only used when contentLayout is "grid"
    "gap": "xl",                  // Spacing between content items
    "stickyOffset": "100px",      // Distance from top when sticky
    "navWidth": "280px"           // Width of navigation sidebar
  },
  "components": {
    "step_1": {
      "type": "contentCard",
      "props": {
        "itemKey": "step-1",          // REQUIRED: Unique key for navigation
        "title": "Step 1",            // REQUIRED: Shows in navigation
        "navDescription": "Details",  // Optional: Shows in accordion when expanded
        "heading": "First Step",
        "subheading": "Getting started",
        "imageSrc": "/path/to/image.jpg"
        // ... rest of contentCard props
      }
    },
    "step_2": {
      "type": "contentCard",
      "props": {
        "itemKey": "step-2",
        "title": "Step 2",
        "navDescription": "More details",
        "heading": "Second Step",
        // ...
      }
    }
  },
  "order": ["step_1", "step_2"]
}
```

## Required Props on Components

Each component in the pattern MUST have:
- `itemKey` - Unique identifier for navigation
- `title` - Text shown in navigation sidebar

Optional:
- `navDescription` - Additional text (shown when accordion is expanded)

## Examples

### Example 1: Process Steps with List Navigation

```json
{
  "type": "stickyNavContent",
  "props": {
    "navVariant": "list",
    "contentLayout": "stack",
    "gap": "2xl",
    "stickyOffset": "100px",
    "navWidth": "300px"
  },
  "components": {
    "step_1": {
      "type": "contentCard",
      "props": {
        "itemKey": "contact",
        "title": "Steg 1: Första kontakt",
        "navDescription": "Överenskommelse om strategi",
        "heading": "Steg 1: Första kontakt & upplägg",
        "subheading": "Överenskommelse om strategi",
        "description": "Ni kontaktar oss och vi kommer överens om upplägg...",
        "imageSrc": "/images/contact.jpg"
      }
    },
    "step_2": {
      "type": "contentCard",
      "props": {
        "itemKey": "analysis",
        "title": "Steg 2: Marknadsanalys",
        "navDescription": "Slå konkurrensen",
        "heading": "Steg 2: Marknadsanalys & brief",
        // ...
      }
    }
  },
  "order": ["step_1", "step_2"]
}
```

### Example 2: Feature Showcase with Accordion

```json
{
  "type": "stickyNavContent",
  "props": {
    "navVariant": "accordion",
    "contentLayout": "stack",
    "gap": "xl",
    "stickyOffset": "120px",
    "navWidth": "320px"
  },
  "components": {
    "feature_1": {
      "type": "contentCard",
      "props": {
        "itemKey": "analytics",
        "title": "Analytics Dashboard",
        "navDescription": "Track your performance in real-time",
        "heading": "Real-time Analytics",
        "imageSrc": "/images/analytics.jpg"
      }
    }
  },
  "order": ["feature_1"]
}
```

### Example 3: Grid Layout with Multiple Cards

```json
{
  "type": "stickyNavContent",
  "props": {
    "navVariant": "list",
    "contentLayout": "grid",
    "gridColumns": 2,
    "gap": "lg",
    "stickyOffset": "100px"
  },
  "components": {
    "item_1": {
      "type": "contentCard",
      "props": {
        "itemKey": "item-1",
        "title": "Item 1",
        "heading": "First Item"
      }
    },
    "item_2": {
      "type": "contentCard",
      "props": {
        "itemKey": "item-2",
        "title": "Item 2",
        "heading": "Second Item"
      }
    }
  },
  "order": ["item_1", "item_2"]
}
```

## Props Reference

### Pattern Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `navVariant` | `'list' \| 'accordion'` | `'list'` | Navigation style |
| `contentLayout` | `'stack' \| 'grid'` | `'stack'` | Content arrangement |
| `gridColumns` | `number` | `1` | Columns when using grid layout |
| `gap` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'` | `'xl'` | Space between items |
| `stickyOffset` | `string` | `'100px'` | Top offset for sticky nav |
| `navWidth` | `string` | `'280px'` | Width of navigation sidebar |

### Component Props

Each component must include:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `itemKey` | `string` | ✅ Yes | Unique identifier for navigation |
| `title` | `string` | ✅ Yes | Text shown in nav sidebar |
| `navDescription` | `string` | Optional | Additional text (shown in accordion) |

Plus all standard props for the component type (e.g., ContentCard props).

## Best Practices

1. **Use list variant for linear processes** - Better for step-by-step guides
2. **Use accordion variant for detailed sections** - Good when descriptions add value
3. **Keep titles short** - 2-4 words ideal for navigation
4. **Use descriptions sparingly** - Only when they add real value
5. **Consistent itemKey naming** - Use descriptive keys like "contact", "analysis", not "item1", "item2"
6. **Appropriate stickyOffset** - Account for fixed headers (usually 80-120px)
7. **Responsive testing** - On mobile, nav moves to top (not sticky)

## Troubleshooting

### Navigation not appearing
- Check that all components have `itemKey` and `title` props
- Verify components are in the `order` array

### Auto-scroll not working
- Ensure `itemKey` values are unique
- Check that content is being rendered

### Content overlapping
- Adjust `stickyOffset` to account for fixed headers
- Increase `gap` between content items
