De enda filer från pattern som kommer till användning just nu är SectionHeader, navbar. Detta gäller för klient-hemsidor, det finns en del filer som används för annat. Vi borde inte ha hårdkodade navbars. 

De mest kraftfulla och betydelse fulla mapparna i blimpify-ui är tokens, core och components. 

CHECK - Jag kan skapa types.ts filer kopplat till komponenter för att separera logik. Exemeplvis kan core/animations/types flyttas till components/animations istället.

CHECK - Jag tror att vi kan flytta innehållet i blimpify-ui/design/system/core/content till loaders.ts och detsamma med blimpify-ui/design/system/core/config.

CHECK - Background props i page nodes och i section filen kan göras smartare än att bara spränga filerna. 

CHECK - Dessutom behöver jag se över PageBackground komponenten samband med detta.

I samband med den flytten ser vi nog enklare hur vi skapar json schema rules för components, och vidare för patterns layout osv.

CHECK - Ta reda på vart LayoutRenderer bäst hör hemma. 

Alla scripts vi har borde köras i build script innan man kan klicka "publicera" en klient sida för lansering.



"defaults": {
  "image": { "type": "image" },
  "heading": { "type": "heading", "props": { "level": 3 } }
},
"items": [
  {
    "id": "alice",
    "components": {
      "image": { "props": { "src": "..." } },
      "heading": { "props": { "content": "Alice" } }
    }
  }
]



{
  "patterns": {
    "sectionHeader_fdsH2a": {
      "type": "sectionHeader",
      "props": {
        "spacing": "lg"
      },
      "components": {
        "heading_Q2tS8v": {
          "type": "heading",
          "props": {
            "content": "Möt oss"
          }
        },
        "body_R5uT1w": {
          "type": "body",
          "props": {
            "content": "Vi är bästa vänner, systrar & kollegor som skapar den ultimata kombinationen för kreativitet och marknadsföring."
          }
        }
      }
    },
    "cardsPattern_X9pL2k": {
      "type": "pattern",
      "props": {
        "useMediaWidth": false
      },
      "layout": {
        "type": "grid",
        "columns": { "base": 1, "lg": 2 },
        "gap": "lg",
        "template": {
          "children": [
            {
              "type": "gridItem",
              "colSpan": 1,
              "children": [
                {
                  "type": "vstack",
                  "gap": "xs",
                  "children": [
                    { 
                      "component": "${image}", 
                      "radius": "md", 
                      "objectFit": "contain",
                      "animation": {
                        "type": "fadeIn",
                        "settings": { "duration": 300 }
                      }
                    },
                    { 
                      "component": "${heading}", 
                      "level": 3 
                    },
                    { 
                      "component": "${body}" 
                    }
                  ]
                }
              ]
            }
          ]
        },
        "items": [
          {
            "id": "item_kH7x9L",
            "components": {
              "image_mN3pL2": {
                "type": "image",
                "props": {
                  "src": "https://cdn.blimpify-im.com/members/6a2c4e76-7c83-4f30-a321-58fc0b1a5508/images/rosasyster.PNG",
                  "alt": "Alice"
                }
              },
              "heading_Q2tS8v": {
                "type": "heading",
                "props": {
                  "content": "Alice"
                }
              },
              "body_R5uT1w": {
                "type": "body",
                "props": {
                  "content": "Studenten med stenkoll på glow, hudvård och färg. Självutnämnd MUA med humor som superkraft och en talang för unik, färgsprakande redigering."
                }
              }
            }
          },
          {
            "id": "item_xP9vR3",
            "components": {
              "image_jL4kM7": {
                "type": "image",
                "props": {
                  "src": "https://cdn.blimpify-im.com/members/6a2c4e76-7c83-4f30-a321-58fc0b1a5508/images/gro%CC%88nsyster.png",
                  "alt": "Felicia"
                }
              },
              "heading_wK8nT5": {
                "type": "heading",
                "props": {
                  "content": "Felicia"
                }
              },
              "body_qY2mH6": {
                "type": "body",
                "props": {
                  "content": "Tvåbarnsmamman som jonglerar blöjbyten, vardagsdrama, senaste trender, hårstyling & skrattattacker som om det vore en OS-gren."
                }
              }
            }
          }
        ]
      },
      "order": []
    }
  },
  "order": ["sectionHeader_fdsH2a", "cardsPattern_X9pL2k"]
}

{
  "patterns": {
    "{patternId}": {
      "type": "sectionHeader | pattern | ...",
      "props": { },
      "components": { },
      "layout": {
        "type": "grid | vstack | hstack | ...",
        "{layoutProps}": "...",
        "template": {
          "children": [
            {
              "type": "gridItem | vstack | hstack | box | ...",
              "{layoutProps}": "...",
              "children": [
                {
                  "type": "...",
                  "children": [
                    { 
                      "component": "${componentType}",
                      "{stylingProps}": "...",
                      "animation": {
                        "type": "fadeIn | slideIn | ...",
                        "settings": { }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        "items": [
          {
            "id": "item_{random6}",
            "components": {
              "{componentType}_{random6}": {
                "type": "image | heading | body | button | ...",
                "props": {
                  "{contentProps}": "..."
                }
              }
            }
          }
        ]
      },
      "order": []
    }
  },
  "order": ["{patternId}", "..."]
}

patterns
├── {patternId}
│   ├── type
│   ├── props
│   ├── components (för enkla patterns utan layout)
│   └── layout
│       ├── type (grid, vstack, hstack...)
│       ├── {layoutProps} (columns, gap, spacing...)
│       ├── template
│       │   └── children[]
│       │       └── {layoutNode}
│       │           ├── type (gridItem, vstack, box...)
│       │           ├── {layoutProps}
│       │           └── children[]
│       │               └── {componentRef}
│       │                   ├── component: "${type}"
│       │                   ├── {stylingProps}
│       │                   └── animation?
│       └── items[]
│           └── {item}
│               ├── id: "item_{random6}"
│               └── components
│                   └── {type}_{random6}
│                       ├── type
│                       └── props
│                           └── {contentProps}
└── order[]



Ny type konvention
type	Beskrivning	Data-struktur
sectionHeader	Hårdkodad pattern (legacy)	components
flat	Enkel layout med items	items[]
nested	Kategoriserad layout	categories[] → items[]



patterns
├── {patternId}
│   ├── type: "sectionHeader" | "flat" | "nested"
│   ├── props
│   │
│   ├── components                    ← Om type: "sectionHeader"
│   │
│   └── layout                        ← Om type: "flat" | "nested"
│       ├── type (grid, vstack...)
│       ├── {layoutProps}
│       ├── template
│       │   └── children[]
│       │
│       ├── items[]                   ← Om type: "flat"
│       │   └── { id, components }
│       │
│       └── categories[]              ← Om type: "nested"
│           └── { id, components, items[] }


rendering av components sker i components listan men med villkor att det måste finnas deklarerat i layout liksom annars kan den inte renderas. (för att undvika att man kan rendera vilken komponent som helst)



FULLT STRUKTUR TRÄD:

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
│       ├── defaults?
│       │   └── {componentType}
│       │       ├── type
│       │       ├── props
│       │       └── animation?
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
        "defaults?": { },
        "items?": [ ],
        "categories?": [ ]
      }
    }
  },
  "order": [ ]
}