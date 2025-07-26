/* ==============================================
   FILE 4: src/design-system/components/patterns/ThemeControls/ThemeControls.tsx
   Create this for your design system
   ============================================== */

'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '../../../primitives';
import { H4 } from '../../../primitives';
import Icon from '../../../primitives/Icon';
import { MoonIcon, SunIcon } from 'lucide-react';


interface BrandColor {
  name: string;
  value: string;
  color: string;
}

export function ThemeControls() {
  const { currentTheme, isDark, setTheme, toggleDarkMode, setBrandColor } = useTheme();

  const brandColors: BrandColor[] = [
    { name: 'Purple', value: 'purple', color: '#A855F7' },
    { name: 'Blue', value: 'blue', color: '#3182CE' },
    { name: 'Teal', value: 'teal', color: '#319795' },
    { name: 'Pink', value: 'pink', color: '#D53F8C' },
    { name: 'Indigo', value: 'indigo', color: '#5A67D8' },
    { name: 'Cyan', value: 'cyan', color: '#00B5D8' },
  ];

  const getCurrentBrandColor = (): string => {
    for (const color of brandColors) {
      if (currentTheme.includes(color.value)) {
        return color.value;
      }
    }
    return 'purple'; // default
  };

  return (
    <div className="theme-controls">
      {/* Dark Mode Toggle */}
      <div className="theme-section">
        <H4>Appearance</H4>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="theme-toggle"
        >
          <Icon>
            {isDark ? <SunIcon /> : <MoonIcon />}
          </Icon>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </div>

      {/* Brand Color Picker */}
      <div className="theme-section">
        <H4>Brand Color</H4>
        <div className="color-options">
          {brandColors.map((color) => (
            <button
              key={color.value}
              className={`color-swatch ${
                getCurrentBrandColor() === color.value ? 'active' : ''
              }`}
              style={{ backgroundColor: color.color }}
              onClick={() => setBrandColor(color.value)}
              title={color.name}
              aria-label={`Switch to ${color.name} theme`}
            />
          ))}
        </div>
      </div>

      {/* Quick Theme Presets */}
      <div className="theme-section">
        <H4>Quick Themes</H4>
        <div className="theme-presets">
          <Button 
            size="sm" 
            variant={currentTheme === 'light' ? 'primary' : 'secondary'}
            onClick={() => setTheme('light')}
          >
            Light
          </Button>
          <Button 
            size="sm" 
            variant={currentTheme === 'dark' ? 'primary' : 'secondary'}
            onClick={() => setTheme('dark')}
          >
            Dark
          </Button>
          <Button 
            size="sm" 
            variant={currentTheme === 'blue' ? 'primary' : 'secondary'}
            onClick={() => setTheme('blue')}
          >
            Blue
          </Button>
          <Button 
            size="sm" 
            variant={currentTheme === 'dark-teal' ? 'primary' : 'secondary'}
            onClick={() => setTheme('dark-teal')}
          >
            Dark Teal
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ==============================================
   USAGE EXAMPLES: How to use in your components
   ============================================== 

// Example 1: In a settings page
import { ThemeControls } from '@/design-system/components/patterns/ThemeControls';

function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <ThemeControls />
    </div>
  );
}

// Example 2: Simple toggle in header
import { useTheme } from '@/context/ThemeContext';

function Header() {
  const { isDark, toggleDarkMode } = useTheme();
  
  return (
    <header>
      <nav>Navigation items...</nav>
      <button onClick={toggleDarkMode}>
        {isDark ? '☀️' : '🌙'}
      </button>
    </header>
  );
}

// Example 3: Custom brand color picker
import { useTheme } from '@/context/ThemeContext';

function CustomColorPicker() {
  const { setBrandColor, currentTheme } = useTheme();
  
  return (
    <div>
      <button onClick={() => setBrandColor('blue')}>Blue Theme</button>
      <button onClick={() => setBrandColor('teal')}>Teal Theme</button>
      <p>Current: {currentTheme}</p>
    </div>
  );
} */
