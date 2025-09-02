// ===============================================
// AccentColorControl.tsx - Enhanced with Animation & Consistent Heights
// ===============================================
import React, { useState, useRef, useEffect } from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Body, Icon, Button } from '@blimpify-im/ui';

// Main color categories - Inspired by Chakra UI's 10-color palette
const MAIN_COLORS = [
  { value: 'pink', label: 'Pink', hex: '#F43F5E', category: 'pink' },
  { value: 'red', label: 'Red', hex: '#EF4444', category: 'red' },
  { value: 'orange', label: 'Orange', hex: '#F97316', category: 'orange' },
  { value: 'yellow', label: 'Yellow', hex: '#F59E0B', category: 'yellow' },
  { value: 'green', label: 'Green', hex: '#10B981', category: 'green' },
  { value: 'teal', label: 'Teal', hex: '#14B8A6', category: 'teal' },
  { value: 'blue', label: 'Blue', hex: '#3B82F6', category: 'blue' },
  { value: 'indigo', label: 'Indigo', hex: '#6366F1', category: 'indigo' },
  { value: 'purple', label: 'Purple', hex: '#A855F7', category: 'purple' },
  { value: 'gray', label: 'Gray', hex: '#6B7280', category: 'gray' },
];

// Color variants for each category
const COLOR_VARIANTS = {
  gray: [
    { value: 'gray-light', label: 'Light Gray', hex: '#9CA3AF' },
    { value: 'gray', label: 'Gray', hex: '#6B7280' },
    { value: 'gray-dark', label: 'Dark Gray', hex: '#374151' },
    { value: 'slate', label: 'Slate', hex: '#64748B' },
    { value: 'charcoal', label: 'Charcoal', hex: '#1F2937' },
  ],
  red: [
    { value: 'red-light', label: 'Light Red', hex: '#FCA5A5' },
    { value: 'red', label: 'Red', hex: '#EF4444' },
    { value: 'red-dark', label: 'Dark Red', hex: '#DC2626' },
    { value: 'crimson', label: 'Crimson', hex: '#DC143C' },
    { value: 'ruby', label: 'Ruby', hex: '#E11D48' },
  ],
  orange: [
    { value: 'orange-light', label: 'Light Orange', hex: '#FB923C' },
    { value: 'orange', label: 'Orange', hex: '#F97316' },
    { value: 'orange-dark', label: 'Dark Orange', hex: '#EA580C' },
    { value: 'amber', label: 'Amber', hex: '#F59E0B' },
    { value: 'tangerine', label: 'Tangerine', hex: '#FF8C00' },
  ],
  yellow: [
    { value: 'yellow-light', label: 'Light Yellow', hex: '#FDE047' },
    { value: 'yellow', label: 'Yellow', hex: '#F59E0B' },
    { value: 'yellow-dark', label: 'Dark Yellow', hex: '#D97706' },
    { value: 'honey', label: 'Honey', hex: '#FBBF24' },
    { value: 'gold', label: 'Gold', hex: '#FFD700' },
  ],
  green: [
    { value: 'green-light', label: 'Light Green', hex: '#4ADE80' },
    { value: 'green', label: 'Green', hex: '#10B981' },
    { value: 'green-dark', label: 'Dark Green', hex: '#059669' },
    { value: 'emerald', label: 'Emerald', hex: '#10B981' },
    { value: 'forest', label: 'Forest Green', hex: '#047857' },
  ],
  teal: [
    { value: 'teal-light', label: 'Light Teal', hex: '#5EEAD4' },
    { value: 'teal', label: 'Teal', hex: '#14B8A6' },
    { value: 'teal-dark', label: 'Dark Teal', hex: '#0F766E' },
    { value: 'cyan', label: 'Cyan', hex: '#06B6D4' },
    { value: 'turquoise', label: 'Turquoise', hex: '#40E0D0' },
  ],
  blue: [
    { value: 'blue-light', label: 'Light Blue', hex: '#60A5FA' },
    { value: 'blue', label: 'Blue', hex: '#3B82F6' },
    { value: 'blue-dark', label: 'Dark Blue', hex: '#1D4ED8' },
    { value: 'azure', label: 'Azure', hex: '#0EA5E9' },
    { value: 'navy', label: 'Navy', hex: '#1E40AF' },
  ],
  indigo: [
    { value: 'indigo-light', label: 'Light Indigo', hex: '#A5B4FC' },
    { value: 'indigo', label: 'Indigo', hex: '#6366F1' },
    { value: 'indigo-dark', label: 'Dark Indigo', hex: '#4338CA' },
    { value: 'periwinkle', label: 'Periwinkle', hex: '#818CF8' },
    { value: 'midnight', label: 'Midnight Blue', hex: '#312E81' },
  ],
  purple: [
    { value: 'purple-light', label: 'Light Purple', hex: '#C084FC' },
    { value: 'purple', label: 'Purple', hex: '#A855F7' },
    { value: 'purple-dark', label: 'Dark Purple', hex: '#7C3AED' },
    { value: 'violet', label: 'Violet', hex: '#8B5CF6' },
    { value: 'plum', label: 'Plum', hex: '#9333EA' },
  ],
  pink: [
    { value: 'pink-light', label: 'Light Pink', hex: '#F9A8D4' },
    { value: 'pink', label: 'Pink', hex: '#F43F5E' },
    { value: 'pink-dark', label: 'Dark Pink', hex: '#E11D48' },
    { value: 'rose', label: 'Rose', hex: '#FB7185' },
    { value: 'magenta', label: 'Magenta', hex: '#EC4899' },
  ],
};

interface AccentColorControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function AccentColorControl({ columns = 4, className }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();
  const [currentView, setCurrentView] = useState<'main' | string>('main');
  const [isAnimating, setIsAnimating] = useState(false);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const mainColorsRef = useRef<HTMLDivElement>(null);
  const variantsRef = useRef<HTMLDivElement>(null);

  // Calculate and set consistent container height
  useEffect(() => {
    const calculateHeight = () => {
      const mainHeight = mainColorsRef.current?.scrollHeight || 0;
      const variantsHeight = variantsRef.current?.scrollHeight || 0;
      const maxHeight = Math.max(mainHeight, variantsHeight, 300); // Minimum 300px
      setContainerHeight(maxHeight);
    };

    // Calculate height after render
    const timer = setTimeout(calculateHeight, 100);
    
    // Recalculate on window resize
    window.addEventListener('resize', calculateHeight);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateHeight);
    };
  }, [currentView]);

  // Convert from DesignRadioCard's string onChange to theme system
  const handleColorChange = (colorValue: string) => {
    console.log('🎨 AccentColorControl: Changing color to:', colorValue);
    setAccentColor(colorValue as ColorScale);
  };

  // Handle main color click - navigate to variants with smooth animation
  const handleMainColorClick = (category: string) => {
    setIsAnimating(true);
    setCurrentView(category);
    // Reset animation state after transition completes
    setTimeout(() => setIsAnimating(false), 400);
  };

  // Handle back to main colors with smooth reverse animation
  const handleBackToMain = () => {
    setIsAnimating(true);
    setCurrentView('main');
    setTimeout(() => setIsAnimating(false), 400);
  };

  // Get current category label for header
  const getCurrentCategoryLabel = () => {
    const mainColor = MAIN_COLORS.find(color => color.category === currentView);
    return mainColor ? mainColor.label : currentView;
  };

  // Check which category the current accent color belongs to
  const getSelectedCategory = () => {
    if (!accentColor) return null;
    
    // Check if it's directly a main color
    const directMatch = MAIN_COLORS.find(color => color.value === accentColor);
    if (directMatch) return directMatch.category;
    
    // Check if it's a variant
    for (const [category, variants] of Object.entries(COLOR_VARIANTS)) {
      const variantMatch = variants.find(variant => variant.value === accentColor);
      if (variantMatch) return category;
    }
    
    return null;
  };

  return (
    <div className={className}>
      {/* Dynamic Section Header */}
      <div className="flex items-center gap-3 mb-4">
        {currentView !== 'main' && (
          <button
            onClick={handleBackToMain}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isAnimating}
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
        )}
        
        <Icon size="md" color="primary">
          <SwatchIcon />
        </Icon>
        
        <div>
          <Body weight="medium" className="mb-1">
            {currentView === 'main' ? 'Brand Color' : `${getCurrentCategoryLabel()} Variants`}
          </Body>
          <Body size="sm" color="secondary">
            {currentView === 'main' 
              ? 'Choose your primary accent color' 
              : 'Select a specific variant or go back'
            }
          </Body>
        </div>
      </div>

      {/* Container with consistent height and smooth swipe animation */}
      <div 
        className="relative overflow-hidden rounded-lg"
        style={{ 
          height: containerHeight || 'auto',
          minHeight: '300px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Main Colors View */}
        <div
          ref={mainColorsRef}
          className="absolute inset-0"
          style={{
            backgroundColor: 'var(--surface-card, white)',
            transform: currentView === 'main' ? 'translateX(0%)' : 'translateX(-100%)',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="h-full p-1">
            <DesignRadioCard.Root
              name="accent-color-main"
              value={accentColor || ''}
              onChange={() => {}} // Handle clicks manually
              columns={3}
              gap="sm"
              size="md"
            >
              {MAIN_COLORS.map((color) => {
                const selectedCategory = getSelectedCategory();
                const isSelected = selectedCategory === color.category;
                
                return (
                  <div key={color.value} className="relative group">
                    <DesignRadioCardItem
                      value={color.value}
                      label={color.label}
                      variant="color"
                      colorValue={color.hex}
                      onClick={() => handleMainColorClick(color.category)}
                      className={`cursor-pointer hover:scale-105 transition-transform ${
                        isSelected ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                      }`}
                      disabled={isAnimating}
                    />
                  </div>
                );
              })}
            </DesignRadioCard.Root>
          </div>
        </div>

        {/* Variants View */}
        <div
          ref={variantsRef}
          className="absolute inset-0"
          style={{
            backgroundColor: 'var(--surface-card, white)',
            transform: currentView !== 'main' ? 'translateX(0%)' : 'translateX(100%)',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            boxShadow: currentView !== 'main' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none'
          }}
        >
          {currentView !== 'main' && COLOR_VARIANTS[currentView as keyof typeof COLOR_VARIANTS] && (
            <div className="space-y-4 h-full flex flex-col p-1">
              <div className="flex-1">
                <DesignRadioCard.Root
                  name="accent-color-variants"
                  value={accentColor || ''}
                  onChange={handleColorChange}
                  columns={columns}
                  gap="sm"
                  size="md"
                >
                  {COLOR_VARIANTS[currentView as keyof typeof COLOR_VARIANTS].map((variant) => (
                    <DesignRadioCardItem
                      key={variant.value}
                      value={variant.value}
                      label={variant.label}
                      variant="color"
                      colorValue={variant.hex}
                      disabled={isAnimating}
                    />
                  ))}
                </DesignRadioCard.Root>
              </div>

              {/* Back button as secondary action */}
              <div className="flex justify-center pt-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleBackToMain}
                  className="text-gray-600"
                  disabled={isAnimating}
                >
                  ← Back to Main Colors
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}