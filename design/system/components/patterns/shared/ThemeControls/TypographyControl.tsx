// ===============================================
// TypographyControl.tsx - Following the same pattern as AccentColorControl and RadiusControl
// ===============================================
import React, { useEffect } from 'react';
import { SelectionCard, Grid } from '@blimpify-im/ui';
import { PencilIcon } from '@heroicons/react/24/outline';
import { Body, Icon, Label } from '@blimpify-im/ui';

// Font options with proper family declarations
const FONT_OPTIONS = [
  {
    value: 'plus-jakarta',
    label: 'Plus Jakarta Sans',
    family: '"Plus Jakarta Sans", system-ui, sans-serif',
    description: 'Modern & friendly',
    preview: 'Aa Bb Cc',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
  },
  {
    value: 'inter',
    label: 'Inter',
    family: '"Inter", system-ui, sans-serif',
    description: 'Clean & professional',
    preview: 'Aa Bb Cc',
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
  },
  {
    value: 'system',
    label: 'System UI',
    family: 'system-ui, -apple-system, sans-serif',
    description: 'Fast & native',
    preview: 'Aa Bb Cc',
    googleUrl: null // No Google Font needed
  },
];

interface TypographyControlProps {
  columns?: 1 | 2 | 3 | 4;
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
  
  const handleFontChange = (checked: boolean, fontValue: string) => {
    if (checked && onChange) {
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

      {/* Font grid */}
      <Grid columns={columns} gap="md" className="grid-cols-1">
        {FONT_OPTIONS.map((option) => (
          <SelectionCard
            key={option.value}
            type="radio"
            name="font-family"
            value={option.value}
            checked={value === option.value}
            onChange={(checked) => handleFontChange(checked, option.value)}
            size="md"
            controlPosition="right"
          >
            <div className="text-left">
              <Label size="sm" weight="medium" className="mb-2 block">
                {option.label}
              </Label>
              
              {/* Font preview */}
              <div className="mb-3">
                <div
                  className="text-2xl font-medium leading-tight"
                  style={{ fontFamily: option.family }}
                >
                  {option.preview}
                </div>
                <div
                  className="text-sm mt-1 text-gray-600"
                  style={{ fontFamily: option.family }}
                >
                  The quick brown fox
                </div>
              </div>
              
              {/* Description */}
              <Body size="xs" color="secondary">
                {option.description}
              </Body>
            </div>
          </SelectionCard>
        ))}
      </Grid>
    </div>
  );
}