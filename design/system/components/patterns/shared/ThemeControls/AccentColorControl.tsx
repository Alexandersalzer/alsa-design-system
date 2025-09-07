// ===============================================
// AccentColorControl.tsx - Förbättrad med Animation & Konsistenta Höjder (Svenska)
// ===============================================
import React, { useState, useRef, useEffect } from 'react';
import { DesignRadioCard, DesignRadioCardItem } from '@blimpify-im/ui';
import { useTheme, type ColorScale } from '../../../../hooks/useTheme';
import { SwatchIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Body, Icon, Button } from '@blimpify-im/ui';

// Huvudfärgkategorier - Inspirerad av Chakra UI:s 10-färgpalett
const MAIN_COLORS = [
  { value: 'pink', label: 'Rosa', hex: '#F43F5E', category: 'pink' },
  { value: 'red', label: 'Röd', hex: '#EF4444', category: 'red' },
  { value: 'orange', label: 'Orange', hex: '#F97316', category: 'orange' },
  { value: 'yellow', label: 'Gul', hex: '#F59E0B', category: 'yellow' },
  { value: 'green', label: 'Grön', hex: '#10B981', category: 'green' },
  { value: 'teal', label: 'Teal', hex: '#14B8A6', category: 'teal' },
  { value: 'blue', label: 'Blå', hex: '#3B82F6', category: 'blue' },
  { value: 'indigo', label: 'Indigo', hex: '#6366F1', category: 'indigo' },
  { value: 'purple', label: 'Lila', hex: '#A855F7', category: 'purple' },
  { value: 'gray', label: 'Grå', hex: '#6B7280', category: 'gray' },
];

// Färgvarianter för varje kategori
const COLOR_VARIANTS = {
  gray: [
    { value: 'gray-light', label: 'Ljusgrå', hex: '#9CA3AF' },
    { value: 'gray', label: 'Grå', hex: '#6B7280' },
    { value: 'gray-dark', label: 'Mörkgrå', hex: '#374151' },
    { value: 'slate', label: 'Skiffergrå', hex: '#64748B' },
    { value: 'charcoal', label: 'Kolgrå', hex: '#1F2937' },
  ],
  red: [
    { value: 'red-light', label: 'Ljusröd', hex: '#FCA5A5' },
    { value: 'red', label: 'Röd', hex: '#EF4444' },
    { value: 'red-dark', label: 'Mörkröd', hex: '#DC2626' },
    { value: 'crimson', label: 'Karmosinröd', hex: '#DC143C' },
    { value: 'ruby', label: 'Rubinröd', hex: '#E11D48' },
  ],
  orange: [
    { value: 'orange-light', label: 'Ljusorange', hex: '#FB923C' },
    { value: 'orange', label: 'Orange', hex: '#F97316' },
    { value: 'orange-dark', label: 'Mörkorange', hex: '#EA580C' },
    { value: 'amber', label: 'Bärnsten', hex: '#F59E0B' },
    { value: 'tangerine', label: 'Mandarin', hex: '#FF8C00' },
  ],
  yellow: [
    { value: 'yellow-light', label: 'Ljusgul', hex: '#FDE047' },
    { value: 'yellow', label: 'Gul', hex: '#F59E0B' },
    { value: 'yellow-dark', label: 'Mörkgul', hex: '#D97706' },
    { value: 'honey', label: 'Honungsgul', hex: '#FBBF24' },
    { value: 'gold', label: 'Guldig', hex: '#FFD700' },
  ],
  green: [
    { value: 'green-light', label: 'Ljusgrön', hex: '#4ADE80' },
    { value: 'green', label: 'Grön', hex: '#10B981' },
    { value: 'green-dark', label: 'Mörkgrön', hex: '#059669' },
    { value: 'emerald', label: 'Smaragdgrön', hex: '#10B981' },
    { value: 'forest', label: 'Skogsgrön', hex: '#047857' },
  ],
  teal: [
    { value: 'teal-light', label: 'Ljus Teal', hex: '#5EEAD4' },
    { value: 'teal', label: 'Teal', hex: '#14B8A6' },
    { value: 'teal-dark', label: 'Mörk Teal', hex: '#0F766E' },
    { value: 'cyan', label: 'Cyan', hex: '#06B6D4' },
    { value: 'turquoise', label: 'Turkos', hex: '#40E0D0' },
  ],
  blue: [
    { value: 'blue-light', label: 'Ljusblå', hex: '#60A5FA' },
    { value: 'blue', label: 'Blå', hex: '#3B82F6' },
    { value: 'blue-dark', label: 'Mörkblå', hex: '#1D4ED8' },
    { value: 'azure', label: 'Azurblå', hex: '#0EA5E9' },
    { value: 'navy', label: 'Marinblå', hex: '#1E40AF' },
  ],
  indigo: [
    { value: 'indigo-light', label: 'Ljus Indigo', hex: '#A5B4FC' },
    { value: 'indigo', label: 'Indigo', hex: '#6366F1' },
    { value: 'indigo-dark', label: 'Mörk Indigo', hex: '#4338CA' },
    { value: 'periwinkle', label: 'Blåsippa', hex: '#818CF8' },
    { value: 'midnight', label: 'Midnattsblå', hex: '#312E81' },
  ],
  purple: [
    { value: 'purple-light', label: 'Ljuslila', hex: '#C084FC' },
    { value: 'purple', label: 'Lila', hex: '#A855F7' },
    { value: 'purple-dark', label: 'Mörklila', hex: '#7C3AED' },
    { value: 'violet', label: 'Violett', hex: '#8B5CF6' },
    { value: 'plum', label: 'Plommon', hex: '#9333EA' },
  ],
  pink: [
    { value: 'pink-light', label: 'Ljusrosa', hex: '#F9A8D4' },
    { value: 'pink', label: 'Rosa', hex: '#F43F5E' },
    { value: 'pink-dark', label: 'Mörkrosa', hex: '#E11D48' },
    { value: 'rose', label: 'Ros', hex: '#FB7185' },
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

  // Beräkna och sätt konsistent behållarhöjd
  useEffect(() => {
    const calculateHeight = () => {
      const mainHeight = mainColorsRef.current?.scrollHeight || 0;
      const variantsHeight = variantsRef.current?.scrollHeight || 0;
      const maxHeight = Math.max(mainHeight, variantsHeight, 300); // Minimum 300px
      setContainerHeight(maxHeight);
    };

    // Beräkna höjd efter rendering
    const timer = setTimeout(calculateHeight, 100);
    
    // Omberäkna vid fönsterstorlek ändring
    window.addEventListener('resize', calculateHeight);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateHeight);
    };
  }, [currentView]);

  // Konvertera från DesignRadioCards string onChange till tema-systemet
  const handleColorChange = (colorValue: string) => {
    console.log('🎨 AccentColorControl: Ändrar färg till:', colorValue);
    setAccentColor(colorValue as ColorScale);
  };

  // Hantera huvudfärgklick - navigera till varianter med mjuk animation
  const handleMainColorClick = (category: string) => {
    setIsAnimating(true);
    setCurrentView(category);
    // Återställ animationstillstånd efter att övergången är klar
    setTimeout(() => setIsAnimating(false), 250);
  };

  // Hantera tillbaka till huvudfärger med mjuk omvänd animation
  const handleBackToMain = () => {
    setIsAnimating(true);
    setCurrentView('main');
    setTimeout(() => setIsAnimating(false), 400);
  };

  // Hämta aktuell kategorietikett för rubrik
  const getCurrentCategoryLabel = () => {
    const mainColor = MAIN_COLORS.find(color => color.category === currentView);
    return mainColor ? mainColor.label : currentView;
  };

  // Kontrollera vilken kategori den aktuella accentfärgen tillhör
  const getSelectedCategory = () => {
    if (!accentColor) return null;
    
    // Kontrollera om det är direkt en huvudfärg
    const directMatch = MAIN_COLORS.find(color => color.value === accentColor);
    if (directMatch) return directMatch.category;
    
    // Kontrollera om det är en variant
    for (const [category, variants] of Object.entries(COLOR_VARIANTS)) {
      const variantMatch = variants.find(variant => variant.value === accentColor);
      if (variantMatch) return category;
    }
    
    return null;
  };

  return (
    <div className={className}>
      {/* Dynamisk sektionsrubrik */}
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
            {currentView === 'main' ? 'Varumärkesfärg' : `${getCurrentCategoryLabel()}-varianter`}
          </Body>
          <Body size="sm" color="secondary">
            {currentView === 'main' 
              ? 'Välj din primära accentfärg' 
              : 'Välj en specifik variant eller gå tillbaka'
            }
          </Body>
        </div>
      </div>

      {/* Behållare med konsistent höjd och animation */}
      <div 
        className="relative overflow-hidden transition-all duration-300 ease-in-out"
        style={{ 
          height: containerHeight || 'auto',
          minHeight: '300px'
        }}
      >
        {/* Huvudfärgsvy */}
        <div
          ref={mainColorsRef}
          className={`absolute inset-0 transition-transform duration-300 ease-in-out`}
          style={{
            backgroundColor: 'var(--surface-card, white)',
            transform: currentView === 'main' ? 'translateX(0%)' : 'translateX(-100%)'
          }}
        >
          <div className="h-full p-1">
            <DesignRadioCard.Root
              name="accent-color-main"
              value={accentColor || ''}
              onChange={() => {}} // Hantera klick manuellt
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
                      checked={isSelected} // Detta kommer att göra kortet visat som valt
                      className="cursor-pointer hover:scale-105 transition-transform"
                      disabled={isAnimating}
                    />
                  </div>
                );
              })}
            </DesignRadioCard.Root>
          </div>
        </div>

        {/* Variantvy */}
        <div
          ref={variantsRef}
          className={`absolute inset-0 transition-transform duration-300 ease-in-out`}
          style={{
            backgroundColor: 'var(--surface-card, white)',
            transform: currentView !== 'main' ? 'translateX(0%)' : 'translateX(100%)'
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

              {/* Tillbaka-knapp som sekundär åtgärd */}
              <div className="flex justify-center pt-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={handleBackToMain}
                  className="text-gray-600"
                  disabled={isAnimating}
                >
                  ← Tillbaka till huvudfärger
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}