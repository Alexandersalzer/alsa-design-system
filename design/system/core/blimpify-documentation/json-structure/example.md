--<> FULLT STRUKTUR TRÄD, EXAMPLES ETC. <>--

patterns
├── {patternId}
│   ├── type: "sectionHeader" | "items" | "categories"
│   ├── props
│   ├── animation?
│   │
│   ├── components                              ← Om type: "sectionHeader"
│   │   └── {componentType}_{random6}
│   │       ├── type
│   │       └── props
│   │
│   └── layout                                  ← Om type: "flat" | "nested"
│       ├── type (grid, vstack, hstack...)
│       ├── {layoutProps}
│       ├── breakpoints?
│       │   ├── mobile
│       │   │   └── {overrideProps}
│       │   └── tablet
│       │       └── {overrideProps}
│       │
│       ├── template
│       │   └── children[]
│       │       └── {layoutNode}
│       │           ├── type (gridItem, vstack, hstack, box, sticky...)
│       │           ├── {layoutProps}
│       │           ├── breakpoints?
│       │           │   ├── mobile
│       │           │   │   └── {overrideProps}
│       │           │   └── tablet
│       │           │       └── {overrideProps}
│       │           └── children[]
│       │               └── {componentRef}
│       │                   ├── component: "${componentType}"
│       │                   ├── {stylingProps}
│       │                   ├── animation?
│       │                   │   ├── type
│       │                   │   └── settings
│       │                   └── breakpoints?
│       │                       ├── mobile
│       │                       │   └── {overrideProps}
│       │                       └── tablet
│       │                           └── {overrideProps}
│       │
│       ├── items[]                             ← Om type: "items"
│       │   └── {item}
│       │       ├── id: "item_{random6}"
│       │       ├── breakpoints?
│       │       │   └── mobile
│       │       │       └── {overrideProps}
│       │       └── components
│       │           └── {componentType}_{random6}
│       │               ├── type
│       │               └── props
│       │                   └── {contentProps}
│       │
│       └── categories[]                        ← Om type: "categories"
│           └── {category}
│               ├── id: "category_{random6}"
│               ├── breakpoints?
│               ├── components                  ← För yttre template
│               │   └── {componentType}_{random6}
│               └── items[]                     ← För nested template
│                   └── {item}
│                       ├── id: "item_{random6}"
│                       ├── breakpoints?
│                       └── components
│                           └── {componentType}_{random6}
│
└── order[]

{
  "patterns": {
    "{patternId}": {
      "type": "sectionHeader | flat | nested",
      "props": { },
      "animation?": { "type": "...", "settings": { } },
      
      "components?": { },
      
      "layout?": {
        "type": "grid | vstack | hstack | ...",
        "{layoutProps}": "...",
        "breakpoints?": {
          "mobile": { "{overrideProps}": "..." },
          "tablet": { "{overrideProps}": "..." }
        },
        "template": {
          "children": [
            {
              "type": "...",
              "{layoutProps}": "...",
              "breakpoints?": { },
              "children": [
                {
                  "component": "${componentType}",
                  "{stylingProps}": "...",
                  "animation?": { },
                  "breakpoints?": { }
                }
              ]
            }
          ]
        },
        "items?": [ ],
        "categories?": [ ]
      }
    }
  },
  "order": [ ]
}


--<> Content file example <>--

{
  "name": "hem",
  "seo": {
    "title": "UGC-SYSTRAR - Genuint Content",
    "description": "Alice & Felicia..."
  },
  "components": {
    "heading_Q2tS8v": { "content": "UGC-content som når fler" },
    "body_R5uT1w": { "content": "Alice & Felicia - 2 systrar..." },
    "heading_T5nM8k": { "content": "Möt oss" },
    "heading_wK8nT5": { "content": "Alice" },
    "heading_P9qR2v": { "content": "Felicia" }
  }
}