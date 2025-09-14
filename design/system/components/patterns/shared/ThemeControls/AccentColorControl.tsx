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

interface AccentColorControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  logoUrl?: string; // Optional logo URL for brand color extraction
}

export function AccentColorControl({ columns = 3, className, logoUrl }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();
  const [extractingColors, setExtractingColors] = useState(false);

  // ✅ Convert from DesignRadioCard's string onChange to theme system
  const handleColorChange = (colorValue: string) => {
    setAccentColor(colorValue as ColorScale);
  };

  const handleExtractBrandColors = async () => {
    if (!logoUrl) return;
    
    setExtractingColors(true);
    try {
      const colors = await extractColorsFromImage(logoUrl);
      applyColorsWithThemeManager(colors);
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
        value={accentColor || 'purple'}
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
      </DesignRadioCard.Root>

      {/* Brand Colors from Logo */}
      {logoUrl && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Icon size="md" color="secondary">
              <PaintBrushIcon />
            </Icon>
            <div>
              <Body weight="medium" className="mb-1">Brand Colors from Logo</Body>
              <Body size="sm" color="secondary">Extract colors from your uploaded logo</Body>
            </div>
          </div>
          
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExtractBrandColors}
            disabled={extractingColors}
            className="w-full"
          >
            <Icon size="sm">
              <PaintBrushIcon />
            </Icon>
            {extractingColors ? 'Extracting...' : 'Extract from Logo'}
          </Button>
        </div>
      )}
    </div>
  );
}
