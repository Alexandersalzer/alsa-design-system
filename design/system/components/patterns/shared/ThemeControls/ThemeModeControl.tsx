// ===============================================
// ThemeModeControl.tsx - CORRECT FIX based on your actual implementation
// Using checkbox pattern for toggle behavior (not radio)
// ===============================================
import React from 'react';
import { SelectionCard } from '../../../patterns';
import { Grid } from '../../dashboard/page/Grid';
import { Body, Icon, Label } from '../../../primitives';
import { useTheme } from '../../../../hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

interface ThemeModeControlProps {
  className?: string;
}

export function ThemeModeControl({ className }: ThemeModeControlProps) {
  const { isDark, toggleDarkMode, isHydrated } = useTheme();

  const handleLightModeChange = (checked: boolean) => {
    // If light mode is checked and we're currently dark, toggle to light
    if (checked && isDark) {
      toggleDarkMode();
    }
  };

  const handleDarkModeChange = (checked: boolean) => {
    // If dark mode is checked and we're currently light, toggle to dark
    if (checked && !isDark) {
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

      {/* Theme mode grid */}
      <Grid columns={2} gap="md" className="grid-cols-2 max-w-md">
        <SelectionCard
          type="radio"
          checked={!isDark}
          onChange={handleLightModeChange}
          disabled={!isHydrated}
          size="md"
          controlPosition="right"
        >
          <div className="text-center">
            <Label size="sm" weight="medium" className="mb-3 block">
              Light
            </Label>
            <div className="flex flex-col items-center gap-2 mb-3">
              <div className="w-12 h-8 bg-white border border-gray-300 rounded-md flex items-center justify-center">
                <div className="w-8 h-2 bg-gray-800 rounded-sm"></div>
              </div>
              <div className="flex gap-1">
                <div className="w-3 h-2 bg-blue-500 rounded-sm"></div>
                <div className="w-2 h-2 bg-white border border-gray-300 rounded"></div>
              </div>
            </div>
            <Body size="xs" color="secondary">Clean & bright</Body>
          </div>
        </SelectionCard>

        <SelectionCard
          type="radio"
          checked={isDark}
          onChange={handleDarkModeChange}
          disabled={!isHydrated}
          size="md"
          controlPosition="right"
        >
          <div className="text-center">
            <Label size="sm" weight="medium" className="mb-3 block">
              Dark
            </Label>
            <div className="flex flex-col items-center gap-2 mb-3">
              <div className="w-12 h-8 bg-gray-900 border border-gray-700 rounded-md flex items-center justify-center">
                <div className="w-8 h-2 bg-white rounded-sm"></div>
              </div>
              <div className="flex gap-1">
                <div className="w-3 h-2 bg-blue-400 rounded-sm"></div>
                <div className="w-2 h-2 bg-gray-800 border border-gray-600 rounded"></div>
              </div>
            </div>
            <Body size="xs" color="secondary">Easy on eyes</Body>
          </div>
        </SelectionCard>
      </Grid>
    </div>
  );
}