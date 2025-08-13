
// ===============================================
// TypographyControl.tsx - UPDATED to use DesignRadioCard
// ===============================================
import React, { useEffect } from 'react';
import { DesignRadioCard } from '@blimpify-im/ui';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

// Font options with proper family declarations
const FONT_OPTIONS = [
  {
    value: 'plus-jakarta',
    label: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", system-ui, sans-serif',
    description: 'Modern & friendly',
    preview: 'Ag',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
  },
  {
    value: 'inter',
    label: 'Inter',
    family: '"Inter", system-ui, sans-serif',
    description: 'Clean & professional',
    preview: 'Ag',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
  },
  {
    value: 'system',
    label: 'System UI',
    family: 'system-ui, -apple-system, sans-serif',
    description: 'Fast & native',
    preview: 'Ag',
    googleUrl: null // No Google Font needed
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
  
  const handleFontChange = (fontValue: string) => {
    if (onChange) {
      onChange(fontValue);
    }
  };

  // Apply font changes to CSS when value changes
  useEffect(() => {
    const fontOption = FONT_OPTIONS.find(f => f.value === value);
    if (!fontOption) return;

    const root = document.documentElement;
    
    // Apply font family to CSS custom properties
    root.style.setProperty('--font-body-family', fontOption.family);
    root.style.setProperty('--font-heading-family', fontOption.family);
    root.style.setProperty('--foundation-font-primary', fontOption.family);
    root.style.setProperty('--foundation-font-secondary', fontOption.family);
    
    // Apply directly to body
    document.body.style.fontFamily = fontOption.family;

    // Load Google Font if needed
    if (fontOption.googleUrl && !document.querySelector(`link[href="${fontOption.googleUrl}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = fontOption.googleUrl;
      document.head.appendChild(link);
    }

    console.log('🔤 Applied font:', fontOption.label, fontOption.family);
  }, [value]);

  return (
    <div className={className}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <Icon size="md" color="primary">
          <PencilIcon />
        </Icon>
        <div>
          <Body weight="medium" className="mb-1">Typography</Body>
          <Body size="sm" color="secondary">Font family for all text</Body>
        </div>
      </div>

      {/* Font radio group */}
      <DesignRadioCard.Root
        name="font-family"
        value={value}
        onChange={handleFontChange}
        columns={columns}
        gap="md"
        size="md"
      >
        {FONT_OPTIONS.map((option) => (
          <DesignRadioCard.Typography
            key={option.value}
            value={option.value}
            label={option.label}
            fontFamily={option.family}
            fontPreview={option.preview}
          />
        ))}
      </DesignRadioCard.Root>
    </div>
  );
}
