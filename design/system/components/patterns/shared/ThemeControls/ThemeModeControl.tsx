// ===============================================
// ThemeModeControl.tsx - SEGMENTED CONTROL VERSION
// Ersätter din nuvarande DesignRadioCard version
// ===============================================
import React from 'react';
import { SegmentedControl, type SegmentedControlOption } from '@blimpify-im/ui';
import { Body, Icon } from '@blimpify-im/ui';
import { useTheme } from '../../../../hooks/useTheme';
import { SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ThemeModeControlProps {
  className?: string;
  showLabel?: boolean; // Option to show/hide the section label
  size?: 'sm' | 'md' | 'lg'; // SegmentedControl size
}

export function ThemeModeControl({ 
  className, 
  showLabel = true,
  size = 'md'
}: ThemeModeControlProps) {
  const { isDark, toggleDarkMode, isHydrated } = useTheme();

  // ✅ Theme options för SegmentedControl
  const themeOptions: SegmentedControlOption[] = [
    {
      value: 'light',
      label: 'Ljust',
      icon: <SunIcon className="w-4 h-4" />
    },
    {
      value: 'dark', 
      label: 'Mörkt',
      icon: <MoonIcon className="w-4 h-4" />
    }
  ];

  // ✅ Handle theme change - endast växla om nödvändigt
  const handleThemeChange = (value: string) => {
    console.log('🌗 ThemeModeControl: Changing theme to:', value);
    
    const shouldBeDark = value === 'dark';
    
    // Bara växla om det faktiska läget inte matchar det valda
    if (isDark !== shouldBeDark) {
      toggleDarkMode();
    }
  };

  // ✅ Aktuellt värde baserat på isDark state
  const currentValue = isDark ? 'dark' : 'light';

  // Loading state om inte hydratiserad
  if (!isHydrated) {
    return (
      <div className={className}>
        {showLabel && (
          <div className="flex items-center gap-2 mb-3">
            <Icon size="sm" color="primary">
              <SparklesIcon />
            </Icon>
            <Body weight="medium" size="sm">Tema</Body>
          </div>
        )}
        <div className="animate-pulse bg-gray-200 h-10 rounded-lg" />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Section header - optional */}
      {showLabel && (
        <div className="flex items-center gap-2 mb-3">
          <Icon size="sm" color="primary">
            <SparklesIcon />
          </Icon>
          <Body weight="medium" size="sm">Tema</Body>
        </div>
      )}

      {/* ✅ SegmentedControl - tydlig och enkel */}
      <SegmentedControl
        options={themeOptions}
        value={currentValue}
        onChange={handleThemeChange}
        size={size}
        variant="default"
        fullWidth={true}
        disabled={!isHydrated}
      />
    </div>
  );
}