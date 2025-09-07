// ===============================================
// TypographyControl.tsx - FIXAD för att använda direkt DesignRadioCardItem (Svenska)
// ===============================================
import React, { useEffect } from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

// Teckensnittssalternativ med korrekta familjedeklarationer
const FONT_OPTIONS = [
  {
    value: 'plus-jakarta',
    label: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", system-ui, sans-serif',
    description: 'Modern & vänlig',
    preview: 'Ag',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
  },
  {
    value: 'inter',
    label: 'Inter',
    family: '"Inter", system-ui, sans-serif',
    description: 'Ren & professionell',
    preview: 'Ag',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
  },
  {
    value: 'system',
    label: 'System UI',
    family: 'system-ui, -apple-system, sans-serif',
    description: 'Snabb & inbyggd',
    preview: 'Ag',
    googleUrl: null // Inget Google Font behövs
  },
];

interface TypographyControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  value?: string;
  onChange?: (fontValue: string) => void;
}

export function TypographyControl({ 
  columns = 1, 
  className, 
  value = 'plus-jakarta',
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
    const fontOption = FONT_OPTIONS.find(f => f.value === fontValue);
    if (fontOption) {
      applyFontToSystem(fontOption);
    }
  };

  // Funktion för att applicera teckensnitt på CSS-systemet
  const applyFontToSystem = (fontOption: typeof FONT_OPTIONS[0]) => {
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
      document.head.appendChild(link);
    }

    console.log('🔤 Tillämpade teckensnitt:', fontOption.label, fontOption.family);
  };

  // Applicera teckensnittsändringar när värdet ändras
  useEffect(() => {
    const fontOption = FONT_OPTIONS.find(f => f.value === value);
    if (fontOption) {
      applyFontToSystem(fontOption);
    }
  }, [value]);

  return (
    <div className={className}>
      {/* Sektionsrubrik */}
      <div className="flex items-center gap-3 mb-4">
        <Icon size="md" color="primary">
          <PencilIcon />
        </Icon>
        <div>
          <Body weight="medium" className="mb-1">Typografi</Body>
          <Body size="sm" color="secondary">Teckensnittsfamilj för all text</Body>
        </div>
      </div>

      {/* ✅ FIXAD: Använder direkt DesignRadioCardItem istället för bekvämlighetskomponent */}
      <DesignRadioCard.Root
        name="font-family"
        value={value}
        onChange={handleFontChange}
        columns={columns}
        gap="md"
        size="md"
      >
        {FONT_OPTIONS.map((option) => (
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