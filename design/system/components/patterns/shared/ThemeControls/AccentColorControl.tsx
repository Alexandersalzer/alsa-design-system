// ===============================================
// AccentColorControl.tsx - UPDATED to use DesignRadioCard
// ===============================================
import React, { useState } from 'react';
import { DesignRadioCard, DesignRadioCardItem, Button } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon, PaintBrushIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';
import { extractColorsFromImage, applyColorsWithThemeManager } from '../../../../utils/colorExtraction';

// Clean color options - just names and hex values
const COLOR_OPTIONS = [
  { value: 'ruby', label: 'Ruby', hex: '#EF4444' },
  { value: 'purple', label: 'Purple', hex: '#A855F7' },
  { value: 'azure', label: 'Azure', hex: '#3B82F6' },
  { value: 'emerald', label: 'Emerald', hex: '#10B981' },
  { value: 'honey', label: 'Honey', hex: '#F59E0B' },
  { value: 'gray', label: 'Slate', hex: '#6B7280' },
];

// Custom brand colors option
const CUSTOM_BRAND_OPTION = {
  value: 'custom-brand',
  label: 'Custom Brand',
  hex: '#8B5CF6', // Default purple color for the button
  isCustom: true
};

interface AccentColorControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  logoUrl?: string; // Optional logo URL for brand color extraction
}

export function AccentColorControl({ columns = 3, className, logoUrl }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();
  const [extractingColors, setExtractingColors] = useState(false);
  const [extractedColors, setExtractedColors] = useState<{ primary: string; secondary: string } | null>(null);
  const [isCustomBrandActive, setIsCustomBrandActive] = useState(false);

  // Debug: Log logoUrl to see if it's being passed
  console.log('🎨 AccentColorControl logoUrl:', logoUrl);
  console.log('🚫 No logoUrl provided - Custom Brand button not shown:', !logoUrl);

  // ✅ Convert from DesignRadioCard's string onChange to theme system
  const handleColorChange = (colorValue: string) => {
    if (colorValue === 'custom-brand') {
      // Don't change accent color, just extract colors from logo
      if (logoUrl) {
        handleExtractBrandColors();
      }
    } else {
      setAccentColor(colorValue as ColorScale);
      setIsCustomBrandActive(false); // Reset custom brand when selecting other colors
    }
  };

  const handleExtractBrandColors = async () => {
    if (!logoUrl) return;
    
    setExtractingColors(true);
    try {
      const colors = await extractColorsFromImage(logoUrl);
      applyColorsWithThemeManager(colors);
      
      // Store extracted colors and mark custom brand as active
      setExtractedColors({
        primary: colors.primary,
        secondary: colors.secondary || colors.accent
      });
      setIsCustomBrandActive(true);
      
      console.log('🎨 Brand colors extracted from logo:', colors);
    } catch (error) {
      console.error('Failed to extract colors from logo:', error);
    } finally {
      setExtractingColors(false);
    }
  };

  return (
    <div className={className}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <Icon size="md" color="primary">
          <SwatchIcon />
        </Icon>
        <div>
          <Body weight="medium" className="mb-1">Brand Color</Body>
          <Body size="sm" color="secondary">Your primary accent color</Body>
        </div>
      </div>

      {/* ✅ Using DesignRadioCard with Root + Color items */}
      <DesignRadioCard.Root
        name="accent-color"
        value={isCustomBrandActive ? 'custom-brand' : (accentColor || 'purple')}
        onChange={handleColorChange}
        columns={columns}
        gap="sm"
        size="sm"
      >
        {COLOR_OPTIONS.map((option) => (
        <DesignRadioCardItem
        key={option.value}
        value={option.value}
        label={option.label}
        variant="color"
        colorValue={option.hex}
        />
        ))}
        
        {/* Custom Brand Colors option - only show if logo exists */}
        {logoUrl && (
          <DesignRadioCardItem
            key={CUSTOM_BRAND_OPTION.value}
            value={CUSTOM_BRAND_OPTION.value}
            label={extractingColors ? 'Extracting...' : 'Custom Brand'}
            variant="color"
            colorValue={extractedColors?.primary || CUSTOM_BRAND_OPTION.hex}
            disabled={extractingColors}
          />
        )}
      </DesignRadioCard.Root>
    </div>
  );
}
