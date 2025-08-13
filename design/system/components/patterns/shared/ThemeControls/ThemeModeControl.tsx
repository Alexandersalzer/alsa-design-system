// ===============================================
// ThemeModeControl.tsx - COMPACT ICON-ONLY VERSION
// Uses DesignRadioCard but styled like icon buttons
// ===============================================

import React from 'react';
import { DesignRadioCard } from '@blimpify-im/ui';
import { Body, Icon } from '@blimpify-im/ui';
import { useTheme } from '../../../../hooks/useTheme';
import { SunIcon, MoonIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface ThemeModeControlProps {
  className?: string;
  showLabel?: boolean; // Option to show/hide the section label
}

export function ThemeModeControl({ className, showLabel = true }: ThemeModeControlProps) {
  const { isDark, toggleDarkMode, isHydrated } = useTheme();

  // ✅ Handle theme change - convert string to theme action
  const handleThemeChange = (value: string) => {
    console.log('🌗 ThemeModeControl: Changing theme to:', value);
    
    if (value !== 'light' && value !== 'dark') {
      console.warn('Invalid theme value:', value);
      return;
    }

    const themeValue = value as 'light' | 'dark';
    const shouldToggle = (themeValue === 'light' && isDark) || (themeValue === 'dark' && !isDark);
    
    if (shouldToggle) {
      toggleDarkMode();
    }
  };

  const currentTheme = isDark ? 'dark' : 'light';

  return (
    <div className={className}>
      {/* Minimal section header - optional */}
      {showLabel && (
        <div className="flex items-center gap-2 mb-3">
          <Icon size="sm" color="primary">
            <SparklesIcon />
          </Icon>
          <Body weight="medium" size="sm">Theme</Body>
        </div>
      )}

      {/* ✅ COMPACT: Icon-only DesignRadioCard */}
      <DesignRadioCard.Root
        name="theme-mode"
        value={currentTheme}
        onChange={handleThemeChange}
        columns={2}
        gap="xs"
        size="xs"
      >
        {/* Light theme - just icon */}
        <DesignRadioCard.Item
          value="light"
          variant="default"
          disabled={!isHydrated}
          style={{
            minHeight: '32px', // Icon button size
            padding: '6px'      // Tight padding
          }}
        >
          <div className="flex items-center justify-center">
            <Icon size="sm" color={currentTheme === 'light' ? 'accent' : 'secondary'}>
              <SunIcon />
            </Icon>
          </div>
        </DesignRadioCard.Item>

        {/* Dark theme - just icon */}
        <DesignRadioCard.Item
          value="dark"
          variant="default"
          disabled={!isHydrated}
          style={{
            minHeight: '32px', // Icon button size
            padding: '6px'      // Tight padding
          }}
        >
          <div className="flex items-center justify-center">
            <Icon size="sm" color={currentTheme === 'dark' ? 'accent' : 'secondary'}>
              <MoonIcon />
            </Icon>
          </div>
        </DesignRadioCard.Item>
      </DesignRadioCard.Root>
    </div>
  );
}