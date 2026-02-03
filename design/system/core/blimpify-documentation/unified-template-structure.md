# Unified Template Structure

## Overview

The rendering system now uses a **unified template tree** approach where all layout nodes use the same `template` property with nested `children[]`. There are no more special props like `categoryTemplate`, `categoryComponentTemplate`, or `itemsWrapper`.

## Key Concepts

### 1. Single Template Property
- Only one property name: `template`
- Can be nested at any level
- Context switches automatically based on template position

### 2. Context Switching
- **Category-level template**: Pulls components from `category.components`
- **Nested template**: Switches context to iterate through items
- **Item-level template**: Pulls components from `item.components`

### 3. Layout Nodes Are Independent
- No parent layout wrapping everything
- Layouts are just nodes in the template tree
- Each layout renders its own props and children

## Structure Examples

### Example 1: Flat Items Layout

```json
{
  "layout": {
    "template": {
      "children": [
        {
          "type": "grid",
          "columns": { "base": 1, "lg": 3 },
          "gap": "lg",
          "template": {
            "children": [
              {
                "type": "vstack",
                "gap": "sm",
                "children": [
                  { "component": "${image}", "radius": "md" },
                  { "component": "${heading}", "level": 3 },
                  { "component": "${body}" }
                ]
              }
            ]
          }
        }
      ]
    },
    "items": [
      {
        "id": "item_abc123",
        "components": {
          "image_xyz": { "type": "image", "props": { "src": "..." } },
          "heading_def": { "type": "heading", "props": { "content": "Title" } },
          "body_ghi": { "type": "body", "props": { "content": "Description" } }
        }
      }
    ],
    "itemOrder": ["item_abc123"]
  }
}
```

**How it renders:**
1. Outer template renders once (contains Grid)
2. Grid has nested `template` → switches to item iteration
3. For each item, renders VStack with image/heading/body from `item.components`

### Example 2: Categorized Layout with Sticky Headers

```json
{
  "layout": {
    "template": {
      "children": [
        {
          "type": "sticky",
          "top": 0,
          "background": "white",
          "children": [
            { "component": "${heading}", "level": 2 }
          ]
        },
        {
          "type": "grid",
          "columns": 3,
          "gap": "lg",
          "template": {
            "children": [
              {
                "type": "vstack",
                "gap": "sm",
                "children": [
                  { "component": "${image}" },
                  { "component": "${heading}" }
                ]
              }
            ]
          }
        }
      ]
    },
    "categories": [
      {
        "id": "cat_services",
        "components": {
          "heading_abc": {
            "type": "heading",
            "props": { "content": "Services" }
          }
        },
        "items": [
          {
            "id": "item_1",
            "components": {
              "image_def": { "type": "image", "props": { "src": "..." } },
              "heading_ghi": { "type": "heading", "props": { "content": "Service 1" } }
            }
          }
        ],
        "itemOrder": ["item_1"]
      },
      {
        "id": "cat_products",
        "components": {
          "heading_jkl": {
            "type": "heading",
            "props": { "content": "Products" }
          }
        },
        "items": [
          {
            "id": "item_2",
            "components": {
              "image_mno": { "type": "image", "props": { "src": "..." } },
              "heading_pqr": { "type": "heading", "props": { "content": "Product 1" } }
            }
          }
        ],
        "itemOrder": ["item_2"]
      }
    ],
    "categoryOrder": ["cat_services", "cat_products"]
  }
}
```

**How it renders:**
1. Loop through categories: `["cat_services", "cat_products"]`
2. For each category, render the template:
   - **Sticky header**: Renders `${heading}` from `category.components` ("Services" or "Products")
   - **Grid**: Has nested `template` → switches to item iteration
   - For each item in `category.items`, renders VStack with components from `item.components`

**Output HTML structure:**
```
<!-- Category: Services -->
<Sticky>
  <Heading>Services</Heading>
</Sticky>
<Grid>
  <VStack>
    <Image src="..." />
    <Heading>Service 1</Heading>
  </VStack>
</Grid>

<!-- Category: Products -->
<Sticky>
  <Heading>Products</Heading>
</Sticky>
<Grid>
  <VStack>
    <Image src="..." />
    <Heading>Product 1</Heading>
  </VStack>
</Grid>
```

### Example 3: Multiple Layout Wrappers

```json
{
  "layout": {
    "template": {
      "children": [
        {
          "type": "vstack",
          "gap": "xl",
          "children": [
            {
              "type": "sticky",
              "children": [
                { "component": "${heading}" }
              ]
            },
            {
              "type": "hstack",
              "justify": "between",
              "children": [
                { "component": "${button}" },
                { "component": "${button}" }
              ]
            },
            {
              "type": "grid",
              "columns": 4,
              "template": {
                "children": [
                  {
                    "type": "box",
                    "children": [
                      { "component": "${image}" }
                    ]
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  }
}
```

**How it renders:**
1. VStack wraps everything
2. Sticky heading (from category.components)
3. HStack with two buttons (from category.components)
4. Grid with nested template → switches to items
5. Each item renders Box + Image

## Migration Guide

### Old Structure (DEPRECATED)
```json
{
  "layout": {
    "type": "vstack",
    "gap": "xl",
    "template": { "children": [...] },
    "categoryTemplate": { "type": "sticky", ... },
    "categoryComponentTemplate": { ... },
    "itemsWrapper": { "type": "grid", ... }
  }
}
```

### New Structure (UNIFIED)
```json
{
  "layout": {
    "template": {
      "children": [
        {
          "type": "vstack",
          "gap": "xl",
          "children": [
            {
              "type": "sticky",
              "children": [
                { "component": "${heading}" }
              ]
            },
            {
              "type": "grid",
              "template": {
                "children": [...]
              }
            }
          ]
        }
      ]
    }
  }
}
```

## Benefits

1. **Consistent Structure**: Only one way to define templates
2. **Nested Anywhere**: Templates can be nested at any depth
3. **Clear Hierarchy**: Tree structure is self-documenting
4. **Flexible**: Can mix category and item layouts freely
5. **Independent Layouts**: No magic wrapper logic

## Technical Details

### Context Switching Logic

When the renderer encounters a layout node with a `template` property:

```typescript
if (nestedTemplate) {
  // Switch context: iterate through items
  // Components now pulled from item.components
  renderLayoutWithNestedTemplate(...)
}
```

### Component Resolution

Components are resolved by **type**, not by key name:
- Template: `{ "component": "${heading}" }`
- Resolves to first unused component with `type: "heading"`
- Supports multiple components of same type

### Data Flow

```
Layout Definition
  ↓
renderTemplateTree (category-level)
  → Renders layout nodes
  → Pulls from category.components
  → Detects nested template
    ↓
  renderLayoutWithNestedTemplate (item-level)
    → Iterates through items
    → For each item:
      → Renders nested template
      → Pulls from item.components
```

## FAQ

**Q: Can I have multiple nested templates?**
A: Yes! Any layout node can have a `template` property, creating nested iterations.

**Q: What if I don't have categories?**
A: Use flat items structure. The template directly iterates through `layout.items`.

**Q: Can category-level and item-level use different layouts?**
A: Yes! Category-level might use Sticky, while item-level uses Grid. They're independent.

**Q: How do I add a wrapper around everything?**
A: Just nest it in the template tree:
```json
{
  "template": {
    "children": [
      {
        "type": "vstack",
        "children": [
          // Everything else goes here
        ]
      }
    ]
  }
}
```
