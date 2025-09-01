// ===============================================
// AccentColorControl.tsx - UPDATED with expandable color variants
// ===============================================
import React, { useState } from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Body, Icon } from '@blimpify-im/ui';

// Main color categories
const MAIN_COLORS = [
  { value: 'red', label: 'Red', hex: '#EF4444', category: 'red' },
  { value: 'orange', label: 'Orange', hex: '#F97316', category: 'orange' },
  { value: 'yellow', label: 'Yellow', hex: '#F59E0B', category: 'yellow' },
  { value: 'green', label: 'Green', hex: '#10B981', category: 'green' },
  { value: 'blue', label: 'Blue', hex: '#3B82F6', category: 'blue' },
  { value: 'purple', label: 'Purple', hex: '#A855F7', category: 'purple' },
  { value: 'pink', label: 'Pink', hex: '#F43F5E', category: 'pink' },
  { value: 'gray', label: 'Gray', hex: '#6B7280', category: 'gray' },
];

// Color variants for each category
const COLOR_VARIANTS = {
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
  blue: [
    { value: 'blue-light', label: 'Light Blue', hex: '#60A5FA' },
    { value: 'blue', label: 'Blue', hex: '#3B82F6' },
    { value: 'blue-dark', label: 'Dark Blue', hex: '#1D4ED8' },
    { value: 'azure', label: 'Azure', hex: '#0EA5E9' },
    { value: 'navy', label: 'Navy', hex: '#1E40AF' },
  ],
  purple: [
    { value: 'purple-light', label: 'Light Purple', hex: '#C084FC' },
    { value: 'purple', label: 'Purple', hex: '#A855F7' },
    { value: 'purple-dark', label: 'Dark Purple', hex: '#7C3AED' },
    { value: 'indigo', label: 'Indigo', hex: '#6366F1' },
    { value: 'violet', label: 'Violet', hex: '#8B5CF6' },
  ],
  pink: [
    { value: 'pink-light', label: 'Light Pink', hex: '#F9A8D4' },
    { value: 'pink', label: 'Pink', hex: '#F43F5E' },
    { value: 'pink-dark', label: 'Dark Pink', hex: '#E11D48' },
    { value: 'rose', label: 'Rose', hex: '#FB7185' },
    { value: 'magenta', label: 'Magenta', hex: '#EC4899' },
  ],
  gray: [
    { value: 'gray-light', label: 'Light Gray', hex: '#9CA3AF' },
    { value: 'gray', label: 'Gray', hex: '#6B7280' },
    { value: 'gray-dark', label: 'Dark Gray', hex: '#374151' },
    { value: 'slate', label: 'Slate', hex: '#64748B' },
    { value: 'charcoal', label: 'Charcoal', hex: '#1F2937' },
  ],
};

interface AccentColorControlProps {
  columns?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export function AccentColorControl({ columns = 4, className }: AccentColorControlProps) {
  const { accentColor, setAccentColor } = useTheme();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Convert from DesignRadioCard's string onChange to theme system
  const handleColorChange = (colorValue: string) => {
    console.log('🎨 AccentColorControl: Changing color to:', colorValue);
    setAccentColor(colorValue as ColorScale);
  };

  // Handle main color click - toggle expansion
  const handleMainColorClick = (category: string, colorValue: string) => {
    if (expandedCategory === category) {
      // If already expanded, collapse
      setExpandedCategory(null);
    } else {
      // Expand this category
      setExpandedCategory(category);
    }
    // Also set the main color
    handleColorChange(colorValue);
  };

  // Get all colors to display (main + expanded variants)
  const getDisplayColors = () => {
    const colors = [...MAIN_COLORS];
    
    if (expandedCategory && COLOR_VARIANTS[expandedCategory as keyof typeof COLOR_VARIANTS]) {
      const variants = COLOR_VARIANTS[expandedCategory as keyof typeof COLOR_VARIANTS];
      const mainColorIndex = colors.findIndex(color => color.category === expandedCategory);
      
      // Insert variants after the main color
      colors.splice(mainColorIndex + 1, 0, ...variants.map(variant => ({
        ...variant,
        category: expandedCategory,
        isVariant: true
      })));
    }
    
    return colors;
  };

  const displayColors = getDisplayColors();

  return (
    <div className={className}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <Icon size="md" color="primary">
          <SwatchIcon />
        </Icon>
        <div>
          <Body weight="medium" className="mb-1">Brand Color</Body>
          <Body size="sm" color="secondary">
            Choose a main color or click to see variants
          </Body>
        </div>
      </div>

      {/* Color Grid */}
      <DesignRadioCard.Root
        name="accent-color"
        value={accentColor || 'purple'}
        onChange={handleColorChange}
        columns={columns}
        gap="sm"
        size="sm"
      >
        {displayColors.map((option) => {
          const isMainColor = MAIN_COLORS.some(main => main.value === option.value);
          const isExpanded = expandedCategory === option.category;
          
          return (
            <div key={option.value} className="relative">
              <DesignRadioCardItem
                value={option.value}
                label={option.label}
                variant="color"
                colorValue={option.hex}
                onClick={() => {
                  if (isMainColor) {
                    handleMainColorClick(option.category, option.value);
                  } else {
                    handleColorChange(option.value);
                  }
                }}
                className={`
                  ${(option as any).isVariant ? 'ml-4 opacity-90' : ''}
                  ${isMainColor && isExpanded ? 'ring-2 ring-blue-500' : ''}
                `}
              />
              
              {/* Expand/Collapse indicator for main colors */}
              {isMainColor && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm border">
                  {isExpanded ? (
                    <ChevronUpIcon className="w-3 h-3 text-gray-600" />
                  ) : (
                    <ChevronDownIcon className="w-3 h-3 text-gray-600" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </DesignRadioCard.Root>

      {/* Helper text */}
      {expandedCategory && (
        <div className="mt-3 text-center">
          <Body size="sm" color="secondary">
            Showing {expandedCategory} variants • Click main color again to collapse
          </Body>
        </div>
      )}
    </div>
  );
}