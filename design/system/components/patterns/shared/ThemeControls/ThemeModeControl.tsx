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
  value?: string; // External value control
  onChange?: (value: string) => void; // External change handler
}

export function ThemeModeControl({ 
  className, 
  showLabel = true,
  size = 'md',
  value,
  onChange
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

  // ✅ Handle theme change - support both internal and external control
  const handleThemeChange = (newValue: string) => {
    console.log('🌗 ThemeModeControl: Changing theme to:', newValue);
    
    // If external onChange is provided, use it (for ProjectContext integration)
    if (onChange) {
      onChange(newValue);
    }
    
    // Also update internal theme system if needed
    const shouldBeDark = newValue === 'dark';
    if (isDark !== shouldBeDark) {
      toggleDarkMode();
    }
  };

  // ✅ Use external value if provided, otherwise use internal theme state
  const currentValue = value || (isDark ? 'dark' : 'light');

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
        variant="pill"
        fullWidth={true}
        disabled={!isHydrated}
      />
    </div>
  );
}