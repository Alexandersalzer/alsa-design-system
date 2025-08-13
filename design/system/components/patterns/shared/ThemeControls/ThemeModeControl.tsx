// ===============================================
// ThemeModeControl.tsx - FIXED TypeScript error
// ===============================================
import React from 'react';
import { DesignRadioCard } from '@blimpify-im/ui';
import { Body, Icon } from '@blimpify-im/ui';
import { useTheme } from '../../../../hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeModeControlProps {
  className?: string;
}

export function ThemeModeControl({ className }: ThemeModeControlProps) {
  const { isDark, toggleDarkMode, isHydrated } = useTheme();

  // ✅ FIXED: Change handler that accepts string and validates it
  const handleThemeChange = (value: string) => {
    // Type guard to ensure we only accept valid theme values
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

      {/* Theme radio group */}
      <DesignRadioCard.Root
        name="theme-mode"
        value={currentTheme}
        onChange={handleThemeChange} // ✅ Now correctly typed as (value: string) => void
        columns={2}
        gap="sm"
        size="md"
      >
        <DesignRadioCard.Item
          value="light"
          label="Light"
          variant="default"
        >
          <div className="flex items-center gap-2 mb-2">
            <SunIcon className="w-4 h-4" />
            <span className="font-medium">Light</span>
          </div>
          <Body size="xs" color="secondary">Clean & bright</Body>
        </DesignRadioCard.Item>

        <DesignRadioCard.Item
          value="dark"
          label="Dark"
          variant="default"
        >
          <div className="flex items-center gap-2 mb-2">
            <MoonIcon className="w-4 h-4" />
            <span className="font-medium">Dark</span>
          </div>
          <Body size="xs" color="secondary">Easy on eyes</Body>
        </DesignRadioCard.Item>
      </DesignRadioCard.Root>
    </div>
  );
}