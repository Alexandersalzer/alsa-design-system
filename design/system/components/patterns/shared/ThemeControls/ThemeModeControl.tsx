// ===============================================
// ThemeModeControl.tsx - FIXED with proper radio button behavior
// ===============================================
import React from 'react';
import { SelectionCard, SelectionCardGroup } from '../../../patterns';
import { Body, Icon, Label } from '../../../primitives';
import { useTheme } from '../../../../hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeModeControlProps {
  className?: string;
}

export function ThemeModeControl({ className }: ThemeModeControlProps) {
  const { isDark, toggleDarkMode, isHydrated } = useTheme();

  // ✅ FIXED: Single handler for radio group
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
      <div className="flex items-center space-x-3 mb-6">
        <Icon size="md" color="accent">
          {isDark ? <MoonIcon /> : <SunIcon />}
        </Icon>
        <div>
          <Label size="md" weight="semibold">Theme Mode</Label>
          <Body size="sm" color="secondary">Light or dark appearance</Body>
        </div>
      </div>

      {/* ✅ FIXED: Use SelectionCardGroup with radio type */}
      <SelectionCardGroup
        type="radio"
        name="theme-mode" // ✅ IMPORTANT: Same name for radio group
        columns={2}
        gap="md"
      >
        <SelectionCard
          type="radio"
          name="theme-mode" // ✅ IMPORTANT: Same name
          value="light"
          checked={!isDark} // ✅ FIXED: Check based on current state
          onChange={(checked) => handleThemeChange(checked, 'light')}
          label="Light"
          description="Clean & bright"
          icon={<SunIcon />}
        />

        <SelectionCard
          type="radio"
          name="theme-mode" // ✅ IMPORTANT: Same name
          value="dark"
          checked={isDark} // ✅ FIXED: Check based on current state
          onChange={(checked) => handleThemeChange(checked, 'dark')}
          label="Dark"
          description="Easy on eyes"
          icon={<MoonIcon />}
        />
      </SelectionCardGroup>
    </div>
  );
}