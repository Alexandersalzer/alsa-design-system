// ===============================================
// TypographyControl.tsx - OMFATTANDE GOOGLE FONTS KOLLEKTION
// Baserat på verkliga fashion/ecommerce hemsidor och best practices
// ===============================================
import React, { useEffect } from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

// ===== LUXURY & PREMIUM FONTS (Serif) - För eleganta och premium brands =====
const LUXURY_FONTS = [
  {
    value: 'playfair-display',
    label: 'Playfair Display',
    family: '"Playfair Display", Georgia, serif',
    description: 'Luxury fashion, elegant',
    preview: 'Aa',
    category: 'luxury',
    popularSites: 'Used by luxury fashion blogs',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&display=swap'
  },
  {
    value: 'bodoni-moda',
    label: 'Bodoni Moda',
    family: '"Bodoni Moda", Georgia, serif',
    description: 'Haute couture elegans',
    preview: 'Aa',
    category: 'luxury',
    popularSites: 'Luxury fashion websites',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700;800;900&display=swap'
  },
  {
    value: 'cinzel',
    label: 'Cinzel',
    family: '"Cinzel", Georgia, serif',
    description: 'Romersk elegans',
    preview: 'Aa',
    category: 'luxury',
    popularSites: 'Premium brands',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&display=swap'
  },
  {
    value: 'cormorant-garamond',
    label: 'Cormorant Garamond',
    family: '"Cormorant Garamond", Georgia, serif',
    description: 'Klassisk bokelegans',
    preview: 'Aa',
    category: 'luxury',
    popularSites: 'Editorial fashion',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap'
  },
  {
    value: 'literata',
    label: 'Literata',
    family: '"Literata", Georgia, serif',
    description: 'Google\'s book font',
    preview: 'Aa',
    category: 'luxury',
    popularSites: 'Editorial content',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Literata:wght@200;300;400;500;600;700;800&display=swap'
  },
];

// ===== MODERN & GEOMETRIC FONTS - För contemporary och tech brands =====
const MODERN_FONTS = [
  {
    value: 'montserrat',
    label: 'Montserrat',
    family: '"Montserrat", system-ui, sans-serif',
    description: 'Urban Buenos Aires',
    preview: 'Aa',
    category: 'modern',
    popularSites: 'Fashion e-commerce',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'outfit',
    label: 'Outfit',
    family: '"Outfit", system-ui, sans-serif',
    description: 'Geometrisk, modern',
    preview: 'Aa',
    category: 'modern',
    popularSites: 'outfit.io official font',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'space-grotesk',
    label: 'Space Grotesk',
    family: '"Space Grotesk", system-ui, sans-serif',
    description: 'Futuristisk karaktär',
    preview: 'Aa',
    category: 'modern',
    popularSites: 'Tech fashion brands',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
  },
  {
    value: 'lexend',
    label: 'Lexend',
    family: '"Lexend", system-ui, sans-serif',
    description: 'Läsoptimerad',
    preview: 'Aa',
    category: 'modern',
    popularSites: 'UX-focused sites',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Lexend:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'manrope',
    label: 'Manrope',
    family: '"Manrope", system-ui, sans-serif',
    description: 'Modern balans',
    preview: 'Aa',
    category: 'modern',
    popularSites: 'Contemporary brands',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap'
  },
];

// ===== FRIENDLY & ACCESSIBLE FONTS - För tillgängliga och läsbara designs =====
const FRIENDLY_FONTS = [
  {
    value: 'open-sans',
    label: 'Open Sans',
    family: '"Open Sans", system-ui, sans-serif',
    description: '20M+ webbplatser',
    preview: 'Aa',
    category: 'friendly',
    popularSites: 'Most popular web font',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800&display=swap'
  },
  {
    value: 'lato',
    label: 'Lato',
    family: '"Lato", system-ui, sans-serif',
    description: 'Slack använder den',
    preview: 'Aa',
    category: 'friendly',
    popularSites: '12M+ websites, Slack',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@100;300;400;700;900&display=swap'
  },
  {
    value: 'source-sans-3',
    label: 'Source Sans 3',
    family: '"Source Sans 3", system-ui, sans-serif',
    description: 'Adobe\'s open source',
    preview: 'Aa',
    category: 'friendly',
    popularSites: 'Professional sites',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'nunito-sans',
    label: 'Nunito Sans',
    family: '"Nunito Sans", system-ui, sans-serif',
    description: 'Rund och vänlig',
    preview: 'Aa',
    category: 'friendly',
    popularSites: 'Family-friendly brands',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'dm-sans',
    label: 'DM Sans',
    family: '"DM Sans", system-ui, sans-serif',
    description: 'Skärmoptimerad',
    preview: 'Aa',
    category: 'friendly',
    popularSites: 'Digital interfaces',
    googleUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
];

// ===== EDITORIAL & MAGAZINE FONTS - För content-fokuserade sites =====
const EDITORIAL_FONTS = [
  {
    value: 'lora',
    label: 'Lora',
    family: '"Lora", Georgia, serif',
    description: 'Optimerad för skärm',
    preview: 'Aa',
    category: 'editorial',
    popularSites: 'Fashion magazines',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap'
  },
  {
    value: 'alegreya',
    label: 'Alegreya',
    family: '"Alegreya", Georgia, serif',
    description: 'Font of the Decade',
    preview: 'Aa',
    category: 'editorial',
    popularSites: 'Editorial fashion',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Alegreya:wght@400;500;600;700;800;900&display=swap'
  },
  {
    value: 'merriweather',
    label: 'Merriweather',
    family: '"Merriweather", Georgia, serif',
    description: 'Läsbar serif',
    preview: 'Aa',
    category: 'editorial',
    popularSites: 'Blog content',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap'
  },
  {
    value: 'crimson-text',
    label: 'Crimson Text',
    family: '"Crimson Text", Georgia, serif',
    description: 'Boktext serif',
    preview: 'Aa',
    category: 'editorial',
    popularSites: 'Long-form content',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&display=swap'
  },
];

// ===== TRENDY & DISPLAY FONTS - För statements och unique brands =====
const TRENDY_FONTS = [
  {
    value: 'poppins',
    label: 'Poppins',
    family: '"Poppins", system-ui, sans-serif',
    description: 'Geometric trendig',
    preview: 'Aa',
    category: 'trendy',
    popularSites: 'Modern fashion',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'inter',
    label: 'Inter',
    family: '"Inter", system-ui, sans-serif',
    description: 'UI-designad',
    preview: 'Aa',
    category: 'trendy',
    popularSites: 'Tech companies',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'work-sans',
    label: 'Work Sans',
    family: '"Work Sans", system-ui, sans-serif',
    description: 'Professional modern',
    preview: 'Aa',
    category: 'trendy',
    popularSites: 'Corporate fashion',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'rubik',
    label: 'Rubik',
    family: '"Rubik", system-ui, sans-serif',
    description: 'Google Cube font',
    preview: 'Aa',
    category: 'trendy',
    popularSites: 'Clean product sites',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'plus-jakarta-sans',
    label: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", system-ui, sans-serif',
    description: 'Tech startup favorit',
    preview: 'Aa',
    category: 'trendy',
    popularSites: 'Startup brands',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap'
  },
];

// ===== SYSTEM & PERFORMANCE FONTS - För snabb laddning =====
const SYSTEM_FONTS = [
  {
    value: 'system-ui',
    label: 'System UI',
    family: 'system-ui, -apple-system, sans-serif',
    description: 'Snabbast möjliga',
    preview: 'Aa',
    category: 'system',
    popularSites: 'Performance-focused',
    googleUrl: null
  },
  {
    value: 'roboto',
    label: 'Roboto',
    family: '"Roboto", system-ui, sans-serif',
    description: 'Google\'s standard',
    preview: 'Aa',
    category: 'system',
    popularSites: 'Android, Google products',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap'
  },
];

// Kombinera alla fonts
const ALL_FONTS = [...LUXURY_FONTS, ...MODERN_FONTS, ...FRIENDLY_FONTS, ...EDITORIAL_FONTS, ...TRENDY_FONTS, ...SYSTEM_FONTS];

interface TypographyControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  value?: string;
  onChange?: (fontValue: string) => void;
  categories?: ('luxury' | 'modern' | 'friendly' | 'editorial' | 'trendy' | 'system')[];
  showSections?: boolean;
  showPopularSites?: boolean; // Ny prop för att visa vilka sites som använder fonten
}

export function TypographyControl({ 
  columns = 3, 
  className, 
  value = 'inter',
  onChange,
  categories = ['luxury', 'modern', 'friendly', 'editorial', 'trendy'],
  showSections = true,
  showPopularSites = false
}: TypographyControlProps) {
  
  // Filtrera fonts baserat på kategorier
  const getFilteredFonts = () => {
    if (!showSections) {
      return ALL_FONTS.filter(font => categories.includes(font.category as any));
    }
    return ALL_FONTS;
  };

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

  // Helper för att rendera font items
  const renderFontItems = (fonts: typeof ALL_FONTS) => {
    return fonts.map((option) => (
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

  // Render utan sektioner
  if (!showSections) {
    const filteredFonts = getFilteredFonts();
    
    return (
      <div className={className}>
        <div className="flex items-center gap-3 mb-4">
          <Icon size="md" color="primary">
            <PencilIcon />
          </Icon>
          <div>
            <Body weight="medium" className="mb-1">Typografi</Body>
            <Body size="sm" color="secondary">Välj teckensnittsfamilj från {filteredFonts.length} alternativ</Body>
          </div>
        </div>

        <DesignRadioCard.Root
          name="font-family"
          value={value}
          onChange={handleFontChange}
          columns={columns}
          gap="md"
          size="md"
        >
          {renderFontItems(filteredFonts)}
        </DesignRadioCard.Root>
      </div>
    );
  }

  // Render med sektioner
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

      {/* LUXURY & PREMIUM SEKTION */}
      {categories.includes('luxury') && (
        <div className="mb-8">
          <Body weight="medium" className="mb-3 text-gray-900">👑 Luxury & Premium</Body>
          <Body size="sm" color="secondary" className="mb-4">
            Eleganta serif fonts för premium brands och lyxkänsla
          </Body>
          
          <DesignRadioCard.Root
            name="luxury-fonts"
            value={value}
            onChange={handleFontChange}
            columns={columns}
            gap="md"
            size="md"
          >
            {renderFontItems(LUXURY_FONTS)}
          </DesignRadioCard.Root>
        </div>
      )}

      {/* MODERN & GEOMETRIC SEKTION */}
      {categories.includes('modern') && (
        <div className="mb-8">
          <Body weight="medium" className="mb-3 text-gray-900">🎯 Modern & Geometric</Body>
          <Body size="sm" color="secondary" className="mb-4">
            Contemporary sans-serif fonts för tech och moderna brands
          </Body>
          
          <DesignRadioCard.Root
            name="modern-fonts"
            value={value}
            onChange={handleFontChange}
            columns={columns}
            gap="md"
            size="md"
          >
            {renderFontItems(MODERN_FONTS)}
          </DesignRadioCard.Root>
        </div>
      )}

      {/* FRIENDLY & ACCESSIBLE SEKTION */}
      {categories.includes('friendly') && (
        <div className="mb-8">
          <Body weight="medium" className="mb-3 text-gray-900">😊 Friendly & Accessible</Body>
          <Body size="sm" color="secondary" className="mb-4">
            Läsbara och tillgängliga fonts för bred målgrupp
          </Body>
          
          <DesignRadioCard.Root
            name="friendly-fonts"
            value={value}
            onChange={handleFontChange}
            columns={columns}
            gap="md"
            size="md"
          >
            {renderFontItems(FRIENDLY_FONTS)}
          </DesignRadioCard.Root>
        </div>
      )}

      {/* EDITORIAL SEKTION */}
      {categories.includes('editorial') && (
        <div className="mb-8">
          <Body weight="medium" className="mb-3 text-gray-900">📰 Editorial & Magazine</Body>
          <Body size="sm" color="secondary" className="mb-4">
            Serif fonts optimerade för läsning och content-fokus
          </Body>
          
          <DesignRadioCard.Root
            name="editorial-fonts"
            value={value}
            onChange={handleFontChange}
            columns={columns}
            gap="md"
            size="md"
          >
            {renderFontItems(EDITORIAL_FONTS)}
          </DesignRadioCard.Root>
        </div>
      )}

      {/* TRENDY SEKTION */}
      {categories.includes('trendy') && (
        <div className="mb-8">
          <Body weight="medium" className="mb-3 text-gray-900">🔥 Trendy & Popular</Body>
          <Body size="sm" color="secondary" className="mb-4">
            Populära fonts som används av stora tech och fashion brands
          </Body>
          
          <DesignRadioCard.Root
            name="trendy-fonts"
            value={value}
            onChange={handleFontChange}
            columns={columns}
            gap="md"
            size="md"
          >
            {renderFontItems(TRENDY_FONTS)}
          </DesignRadioCard.Root>
        </div>
      )}

      {/* SYSTEM FONTS SEKTION */}
      {categories.includes('system') && (
        <div className="mb-8">
          <Body weight="medium" className="mb-3 text-gray-900">⚡ System & Performance</Body>
          <Body size="sm" color="secondary" className="mb-4">
            Snabba system fonts för optimal prestanda
          </Body>
          
          <DesignRadioCard.Root
            name="system-fonts"
            value={value}
            onChange={handleFontChange}
            columns={columns}
            gap="md"
            size="md"
          >
            {renderFontItems(SYSTEM_FONTS)}
          </DesignRadioCard.Root>
        </div>
      )}

      {/* STATS & INFO BOX */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Body size="sm" className="text-blue-800">
            <strong>📊 Font Stats:</strong><br />
            • {ALL_FONTS.length} professionella fonts<br />
            • 100% gratis för kommersiell användning<br />
            • Baserat på verkliga hemsidor
          </Body>
        </div>
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <Body size="sm" className="text-green-800">
            <strong>💡 Tips:</strong><br />
            • Luxury för premium brands<br />
            • Modern för tech/contemporary<br />
            • Friendly för bred målgrupp
          </Body>
        </div>
      </div>
    </div>
  );
}