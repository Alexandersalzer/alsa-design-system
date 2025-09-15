// ===============================================
// AccentColorControl.tsx - UPDATED to use DesignRadioCard
// ===============================================
import React, { useState, useEffect } from 'react';
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
  setCustomBrand?: () => void; // Function to set custom brand in preferences
}

export function AccentColorControl({ columns = 3, className, logoUrl, setCustomBrand }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();
  
  // Debug logging for accentColor
  useEffect(() => {
    console.log('🎨 AccentColorControl accentColor changed:', accentColor);
  }, [accentColor]);
  const [extractingColors, setExtractingColors] = useState(false);
  const [extractedColors, setExtractedColors] = useState<{ primary: string; secondary: string } | null>(null);

  // Debug: Log logoUrl to see if it's being passed
  console.log('🎨 AccentColorControl logoUrl:', logoUrl);
  console.log('🚫 No logoUrl provided - Custom Brand button not shown:', !logoUrl || logoUrl === '');
  console.log('✅ Should show Custom Brand button:', logoUrl && logoUrl !== '' && logoUrl.startsWith('http'));

  // Force re-render when logoUrl changes
  useEffect(() => {
    console.log('🔄 AccentColorControl logoUrl changed:', logoUrl);
    console.log('🔄 AccentColorControl should show Custom Brand:', logoUrl && logoUrl !== '' && logoUrl.startsWith('http'));
  }, [logoUrl]);

  // Load cached colors when accentColor is 'custom-brand' and we have a logoUrl
  useEffect(() => {
    if (accentColor === 'custom-brand' && logoUrl && logoUrl !== '' && logoUrl.startsWith('http')) {
      const cacheKey = `logo-colors-${logoUrl}`;
      const cachedColors = localStorage.getItem(cacheKey);
      
      if (cachedColors) {
        try {
          const parsed = JSON.parse(cachedColors);
          // Check if cache is not too old (24 hours)
          if (Date.now() - parsed.timestamp < 86400000) {
            // Apply the cached colors to the theme
            applyColorsWithThemeManager(parsed.data);
            
            setExtractedColors({
              primary: parsed.data.primary,
              secondary: parsed.data.secondary || parsed.data.accent
            });
            
            // Also update preferences to custom-brand if not already set
            if (setCustomBrand) {
              setCustomBrand();
            }
            
            console.log('🎨 Loaded cached brand colors on mount:', parsed.data);
          }
        } catch (e) {
          console.warn('Failed to parse cached brand colors');
        }
      }
    }
  }, [accentColor, logoUrl]);

  // ✅ Convert from DesignRadioCard's string onChange to theme system
  const handleColorChange = (colorValue: string) => {
    if (colorValue === 'custom-brand') {
      // Don't change accent color, just extract colors from logo
      if (logoUrl && logoUrl !== '' && logoUrl.startsWith('http')) {
        handleExtractBrandColors();
      }
    } else {
      setAccentColor(colorValue as ColorScale);
    }
  };

  const handleExtractBrandColors = async () => {
    if (!logoUrl || logoUrl === '' || !logoUrl.startsWith('http')) return;
    
    setExtractingColors(true);
    try {
      // Check cache first
      const cacheKey = `logo-colors-${logoUrl}`;
      const cachedColors = localStorage.getItem(cacheKey);
      
      let colors;
      if (cachedColors) {
        try {
          const parsed = JSON.parse(cachedColors);
          // Check if cache is not too old (24 hours)
          if (Date.now() - parsed.timestamp < 86400000) {
            colors = parsed.data;
            console.log('🎨 Using cached brand colors:', colors);
          } else {
            throw new Error('Cache expired');
          }
        } catch (e) {
          // Invalid cache, continue with fresh extraction
          colors = await extractColorsFromImage(logoUrl);
        }
      } else {
        colors = await extractColorsFromImage(logoUrl);
      }
      
      applyColorsWithThemeManager(colors);
      
      // Store extracted colors and mark custom brand as active
      setExtractedColors({
        primary: colors.primary,
        secondary: colors.secondary || colors.accent
      });
      setAccentColor('custom-brand');
      
      // Also update preferences to custom-brand
      if (setCustomBrand) {
        setCustomBrand();
      }
      
      // Cache the result
      localStorage.setItem(cacheKey, JSON.stringify({
        data: colors,
        timestamp: Date.now()
      }));
      
      console.log('🎨 Brand colors extracted and cached:', colors);
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
        
        {/* Custom Brand Colors option - only show if logo exists */}
        {logoUrl && logoUrl !== '' && logoUrl.startsWith('http') && (
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
