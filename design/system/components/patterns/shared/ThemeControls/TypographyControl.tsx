// ===============================================
// TypographyControl.tsx - UNIFIED GRID VERSION
// Alla fonts i samma grid utan kategorisering
// ===============================================
import React, { useEffect } from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

// ===== ALLA FONTS SORTERADE EFTER TYP: SANS-SERIF FÖRST, SERIF SIST =====
const ALL_FONTS = [
  // ===== SANS-SERIF FONTS =====
  
  // System & Performance
  {
    value: 'system-ui',
    label: 'System UI',
    family: 'system-ui, -apple-system, sans-serif',
    description: 'Snabbast möjliga',
    preview: 'Aa',
    googleUrl: null
  },
  {
    value: 'roboto',
    label: 'Roboto',
    family: '"Roboto", system-ui, sans-serif',
    description: 'Google\'s standard',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap'
  },
  
  // Modern & Popular Sans-Serif
  {
    value: 'inter',
    label: 'Inter',
    family: '"Inter", system-ui, sans-serif',
    description: 'UI-designad',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'poppins',
    label: 'Poppins',
    family: '"Poppins", system-ui, sans-serif',
    description: 'Geometric trendig',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'montserrat',
    label: 'Montserrat',
    family: '"Montserrat", system-ui, sans-serif',
    description: 'Urban Buenos Aires',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'open-sans',
    label: 'Open Sans',
    family: '"Open Sans", system-ui, sans-serif',
    description: '20M+ webbplatser',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap'
  },
  {
    value: 'lato',
    label: 'Lato',
    family: '"Lato", system-ui, sans-serif',
    description: 'Slack använder den',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap'
  },
  {
    value: 'work-sans',
    label: 'Work Sans',
    family: '"Work Sans", system-ui, sans-serif',
    description: 'Professional modern',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'dm-sans',
    label: 'DM Sans',
    family: '"DM Sans", system-ui, sans-serif',
    description: 'Skärmoptimerad',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'source-sans-3',
    label: 'Source Sans 3',
    family: '"Source Sans 3", system-ui, sans-serif',
    description: 'Adobe\'s open source',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'nunito-sans',
    label: 'Nunito Sans',
    family: '"Nunito Sans", system-ui, sans-serif',
    description: 'Rund och vänlig',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'plus-jakarta-sans',
    label: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", system-ui, sans-serif',
    description: 'Tech startup favorit',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap'
  },
  
  // Geometric & Unique Sans-Serif
  {
    value: 'outfit',
    label: 'Outfit',
    family: '"Outfit", system-ui, sans-serif',
    description: 'Geometrisk, modern',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'space-grotesk',
    label: 'Space Grotesk',
    family: '"Space Grotesk", system-ui, sans-serif',
    description: 'Futuristisk karaktär',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
  },
  {
    value: 'lexend',
    label: 'Lexend',
    family: '"Lexend", system-ui, sans-serif',
    description: 'Läsoptimerad',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'manrope',
    label: 'Manrope',
    family: '"Manrope", system-ui, sans-serif',
    description: 'Modern balans',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap'
  },
  {
    value: 'rubik',
    label: 'Rubik',
    family: '"Rubik", system-ui, sans-serif',
    description: 'Playful & friendly',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'fira-sans',
    label: 'Fira Sans',
    family: '"Fira Sans", system-ui, sans-serif',
    description: 'Mozilla\'s humanist',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Fira+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'red-hat-display',
    label: 'Red Hat Display',
    family: '"Red Hat Display", system-ui, sans-serif',
    description: 'Corporate friendly',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@300;400;500;600;700;800;900&display=swap'
  },
  
  // ===== MODERN STARTUP/TECH FONTS =====
  
  // AI & Tech Startup Favorites
  {
    value: 'ibm-plex-sans',
    label: 'IBM Plex Sans',
    family: '"IBM Plex Sans", system-ui, sans-serif',
    description: 'IBM\'s modern corporate',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100;200;300;400;500;600;700&display=swap'
  },
  {
    value: 'satoshi',
    label: 'Satoshi',
    family: '"Satoshi", system-ui, sans-serif',
    description: 'Swiss modernist design',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Satoshi:wght@300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'cal-sans',
    label: 'Cal Sans',
    family: '"Cal Sans", system-ui, sans-serif',
    description: 'Y Combinator favorite',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Cal+Sans:wght@300;400;500;600;700;800&display=swap'
  },
  
  // ===== SERIF FONTS =====
  
  // Editorial & Reading Serifs
  {
    value: 'lora',
    label: 'Lora',
    family: '"Lora", Georgia, serif',
    description: 'Optimerad för skärm',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap'
  },
  {
    value: 'merriweather',
    label: 'Merriweather',
    family: '"Merriweather", Georgia, serif',
    description: 'Läsbar serif',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap'
  },
  {
    value: 'crimson-text',
    label: 'Crimson Text',
    family: '"Crimson Text", Georgia, serif',
    description: 'Boktext serif',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap'
  },
  {
    value: 'source-serif-4',
    label: 'Source Serif 4',
    family: '"Source Serif 4", Georgia, serif',
    description: 'Adobe\'s reading serif',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@200;300;400;500;600;700;800;900&display=swap'
  },
  
  // Elegant & Luxury Serifs
  {
    value: 'cormorant-garamond',
    label: 'Cormorant Garamond',
    family: '"Cormorant Garamond", Georgia, serif',
    description: 'Klassisk bokelegans',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap'
  },
  {
    value: 'literata',
    label: 'Literata',
    family: '"Literata", Georgia, serif',
    description: 'Google\'s book font',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Literata:wght@200;300;400;500;600;700;800&display=swap'
  },
  {
    value: 'alegreya',
    label: 'Alegreya',
    family: '"Alegreya", Georgia, serif',
    description: 'Font of the Decade',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;600;700;800;900&display=swap'
  },
  {
    value: 'ebgaramond',
    label: 'EB Garamond',
    family: '"EB Garamond", Georgia, serif',
    description: 'Classical elegance',
    preview: 'Aa',
    googleUrl: 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700;800&display=swap'
  },
];

interface TypographyControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  value?: string;
  onChange?: (fontValue: string) => void;
}

export function TypographyControl({ 
  columns = 3, 
  className, 
  value = 'inter',
  onChange
}: TypographyControlProps) {
  
  // ✅ Hantera teckensnittsbyte och applicera på CSS
  const handleFontChange = (fontValue: string) => {
    console.log('🔤 TypographyControl: Ändrar teckensnitt till:', fontValue);
    
    // Anropa extern onChange om tillgänglig
    if (onChange) {
      onChange(fontValue);
    }
    
    // Applicera teckensnittsändringar omedelbart
    const fontOption = ALL_FONTS.find(f => f.value === fontValue);
    if (fontOption) {
      applyFontToSystem(fontOption);
    }
  };

  // Funktion för att applicera teckensnitt på CSS-systemet
  const applyFontToSystem = (fontOption: typeof ALL_FONTS[0]) => {
    const root = document.documentElement;
    
    // Applicera teckensnittsfamilj på CSS anpassade egenskaper
    root.style.setProperty('--font-body-family', fontOption.family);
    root.style.setProperty('--font-heading-family', fontOption.family);
    root.style.setProperty('--foundation-font-primary', fontOption.family);
    root.style.setProperty('--foundation-font-secondary', fontOption.family);
    
    // Applicera direkt på body
    document.body.style.fontFamily = fontOption.family;

    // Ladda Google Font om nödvändigt
    if (fontOption.googleUrl && !document.querySelector(`link[href="${fontOption.googleUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontOption.googleUrl;
      link.onload = () => console.log(`✅ Font loaded: ${fontOption.label}`);
      document.head.appendChild(link);
    }

    console.log('🔤 Tillämpade teckensnitt:', fontOption.label, fontOption.family);
  };

  // Applicera teckensnittsändringar när värdet ändras
  useEffect(() => {
    const fontOption = ALL_FONTS.find(f => f.value === value);
    if (fontOption) {
      applyFontToSystem(fontOption);
    }
  }, [value]);

  // ✅ FÖRLADDA ALLA GOOGLE FONTS när komponenten mountar
  useEffect(() => {
    console.log('🔤 Förladdar alla Google Fonts...');
    
    ALL_FONTS.forEach((fontOption) => {
      if (fontOption.googleUrl && !document.querySelector(`link[href="${fontOption.googleUrl}"]`)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = fontOption.googleUrl;
        link.onload = () => console.log(`✅ Font förladdat: ${fontOption.label}`);
        document.head.appendChild(link);
      }
    });
  }, []); // Kör bara en gång när komponenten mountar

  // Helper för att rendera font items
  const renderFontItems = () => {
    return ALL_FONTS.map((option) => (
      <DesignRadioCardItem
        key={option.value}
        value={option.value}
        label={option.label}
        variant="typography"
        fontFamily={option.family}
        fontPreview={option.preview}
      />
    ));
  };

  return (
    <div className={className}>
      {/* Huvudrubrik */}
      <div className="flex items-center gap-3 mb-6">
        <Icon size="md" color="primary">
          <PencilIcon />
        </Icon>
        <div>
          <Body weight="medium" className="mb-1">Typografi</Body>
          <Body size="sm" color="secondary">Välj från {ALL_FONTS.length} professionella fonts för din hemsida</Body>
        </div>
      </div>

      {/* Unified Font Grid */}
      <DesignRadioCard.Root
        name="font-family"
        value={value}
        onChange={handleFontChange}
        columns={columns}
        gap="md"
        size="md"
      >
        {renderFontItems()}
      </DesignRadioCard.Root>
    </div>
  );
}