// ===============================================
// TypographyControl.tsx - UTÖKAD med rubrik- och brödtextfonts
// ===============================================
import React, { useEffect } from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

// ===== RUBRIKFONTS - Designade för stora storlekar =====
const HEADING_FONTS = [
  {
    value: 'poppins',
    label: 'Poppins',
    family: '"Poppins", system-ui, sans-serif',
    description: 'Geometrisk & stark',
    preview: 'Aa',
    category: 'heading',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'space-grotesk',
    label: 'Space Grotesk',
    family: '"Space Grotesk", system-ui, sans-serif',
    description: 'Unik karaktär',
    preview: 'Aa',
    category: 'heading',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap'
  },
  {
    value: 'outfit',
    label: 'Outfit',
    family: '"Outfit", system-ui, sans-serif',
    description: 'Geometrisk personlighet',
    preview: 'Aa',
    category: 'heading',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap'
  },
  {
    value: 'manrope',
    label: 'Manrope',
    family: '"Manrope", system-ui, sans-serif',
    description: 'Stark men balanserad',
    preview: 'Aa',
    category: 'heading',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap'
  },
  {
    value: 'plus-jakarta',
    label: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", system-ui, sans-serif',
    description: 'Modern & vänlig',
    preview: 'Aa',
    category: 'heading',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
  },
];

// ===== BRÖDTEXTFONTS - Optimerade för läsbarhet =====
const BODY_FONTS = [
  {
    value: 'dm-sans',
    label: 'DM Sans',
    family: '"DM Sans", system-ui, sans-serif',
    description: 'Skärmläsning',
    preview: 'Aa',
    category: 'body',
    googleUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap'
  },
  {
    value: 'inter',
    label: 'Inter',
    family: '"Inter", system-ui, sans-serif',
    description: 'Perfekt brödtext',
    preview: 'Aa',
    category: 'body',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
  },
  {
    value: 'work-sans',
    label: 'Work Sans',
    family: '"Work Sans", system-ui, sans-serif',
    description: 'Neutral & läsbar',
    preview: 'Aa',
    category: 'body',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap'
  },
  {
    value: 'source-sans-3',
    label: 'Source Sans 3',
    family: '"Source Sans 3", system-ui, sans-serif',
    description: 'Teknisk men läsbar',
    preview: 'Aa',
    category: 'body',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700&display=swap'
  },
  {
    value: 'system',
    label: 'System UI',
    family: 'system-ui, -apple-system, sans-serif',
    description: 'Optimal prestanda',
    preview: 'Aa',
    category: 'body',
    googleUrl: null // Inget Google Font behövs
  },
];

// ===== BONUS FONTS - Extra alternativ =====
const BONUS_FONTS = [
  {
    value: 'geist',
    label: 'Geist',
    family: '"Geist", system-ui, sans-serif',
    description: 'Modern minimalism',
    preview: 'Aa',
    category: 'both',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&display=swap'
  },
  {
    value: 'satoshi',
    label: 'Satoshi',
    family: '"Satoshi", system-ui, sans-serif',
    description: 'Startup favorit',
    preview: 'Aa',
    category: 'both',
    googleUrl: 'https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800&display=swap'
  },
  {
    value: 'cabinet-grotesk',
    label: 'Cabinet Grotesk',
    family: '"Cabinet Grotesk", system-ui, sans-serif',
    description: 'Premium känsla',
    preview: 'Aa',
    category: 'heading',
    googleUrl: 'https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@300,400,500,600,700,800&display=swap'
  },
];

// Kombinera alla fonts
const ALL_FONTS = [...HEADING_FONTS, ...BODY_FONTS, ...BONUS_FONTS];

interface TypographyControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  value?: string;
  onChange?: (fontValue: string) => void;
  // Ny prop för att visa endast vissa kategorier
  categories?: ('heading' | 'body' | 'both')[];
  // Ny prop för att visa sektioner separat
  showSections?: boolean;
}

export function TypographyControl({ 
  columns = 2, 
  className, 
  value = 'inter',
  onChange,
  categories = ['heading', 'body', 'both'],
  showSections = true
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

    // Ladda Google Font eller Fontshare om nödvändigt
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
            <Body size="sm" color="secondary">Välj teckensnittsfamilj</Body>
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
          {filteredFonts.map((option) => (
            <DesignRadioCardItem
              key={option.value}
              value={option.value}
              label={option.label}
              variant="typography"
              fontFamily={option.family}
              fontPreview={option.preview}
            />
          ))}
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
          <Body size="sm" color="secondary">Välj teckensnittsfamilj för din hemsida</Body>
        </div>
      </div>

      {/* RUBRIKFONTS SEKTION */}
      {categories.includes('heading') && (
        <div className="mb-8">
          <Body weight="medium" className="mb-3 text-gray-900">📍 Rubrikfonts</Body>
          <Body size="sm" color="secondary" className="mb-4">
            Starka personligheter, designade för stora storlekar
          </Body>
          
          <DesignRadioCard.Root
            name="heading-fonts"
            value={value}
            onChange={handleFontChange}
            columns={columns}
            gap="md"
            size="md"
          >
            {HEADING_FONTS.map((option) => (
              <DesignRadioCardItem
                key={option.value}
                value={option.value}
                label={option.label}
                variant="typography"
                fontFamily={option.family}
                fontPreview={option.preview}
              />
            ))}
          </DesignRadioCard.Root>
        </div>
      )}

      {/* BRÖDTEXTFONTS SEKTION */}
      {categories.includes('body') && (
        <div className="mb-8">
          <Body weight="medium" className="mb-3 text-gray-900">📖 Brödtextfonts</Body>
          <Body size="sm" color="secondary" className="mb-4">
            Optimerade för läsbarhet i små storlekar
          </Body>
          
          <DesignRadioCard.Root
            name="body-fonts"
            value={value}
            onChange={handleFontChange}
            columns={columns}
            gap="md"
            size="md"
          >
            {BODY_FONTS.map((option) => (
              <DesignRadioCardItem
                key={option.value}
                value={option.value}
                label={option.label}
                variant="typography"
                fontFamily={option.family}
                fontPreview={option.preview}
              />
            ))}
          </DesignRadioCard.Root>
        </div>
      )}

      {/* BONUS FONTS SEKTION */}
      {categories.includes('both') && (
        <div className="mb-8">
          <Body weight="medium" className="mb-3 text-gray-900">✨ Premium alternativ</Body>
          <Body size="sm" color="secondary" className="mb-4">
            Moderna fonts för både rubriker och brödtext
          </Body>
          
          <DesignRadioCard.Root
            name="bonus-fonts"
            value={value}
            onChange={handleFontChange}
            columns={columns}
            gap="md"
            size="md"
          >
            {BONUS_FONTS.map((option) => (
              <DesignRadioCardItem
                key={option.value}
                value={option.value}
                label={option.label}
                variant="typography"
                fontFamily={option.family}
                fontPreview={option.preview}
              />
            ))}
          </DesignRadioCard.Root>
        </div>
      )}

      {/* INFO BOX */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Body size="sm" className="text-blue-800">
          <strong>💡 Tips:</strong> Rubrikfonts fungerar bäst för stora texter medan brödtextfonts är optimerade för läsbarhet i små storlekar.
        </Body>
      </div>
    </div>
  );
}