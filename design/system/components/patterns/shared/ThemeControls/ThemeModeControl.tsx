// ===============================================
// ThemeModeControl.tsx - REVERTED to working SelectionCard version
// ===============================================
import React from 'react';
import { SelectionCard, SelectionCardGroup } from '@blimpify-im/ui';
import { Body, Icon } from '@blimpify-im/ui';
import { useTheme } from '../../../../hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeModeControlProps {
  className?: string;
}

export function ThemeModeControl({ className }: ThemeModeControlProps) {
  const { isDark, toggleDarkMode, isHydrated } = useTheme();

  // Single handler for radio group
  const handleThemeChange = (checked: boolean, themeValue: 'light' | 'dark') => {
    if (!checked) return; // Only act on selection, not deselection
    
    const shouldToggle = (themeValue === 'light' && isDark) || (themeValue === 'dark' && !isDark);
    if (shouldToggle) {
      toggleDarkMode();
    }
  };

  return (
    <div className={className}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-4">
        <Icon size="md" color="primary">
          {isDark ? <MoonIcon /> : <SunIcon />}
        </Icon>
        <div>
          <Body weight="medium" className="mb-1">Theme Mode</Body>
          <Body size="sm" color="secondary">Light or dark appearance</Body>
        </div>
      </div>

      {/* Use SelectionCardGroup with radio type */}
      <SelectionCardGroup
        type="radio"
        name="theme-mode"
        columns={2}
        gap="md"
      >
        <SelectionCard
          type="radio"
          name="theme-mode"
          value="light"
          checked={!isDark}
          onChange={(checked) => handleThemeChange(checked, 'light')}
          label="Light"
          description="Clean & bright"
          icon={<SunIcon />}
        />
        <SelectionCard
          type="radio"
          name="theme-mode"
          value="dark"
          checked={isDark}
          onChange={(checked) => handleThemeChange(checked, 'dark')}
          label="Dark"
          description="Easy on eyes"
          icon={<MoonIcon />}
        />
      </SelectionCardGroup>
    </div>
  );
}
