// ===============================================
// LanguageSelector.tsx - Language selector using Menu component
// ===============================================

'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from '../../overlays/Menu/Menu';
import { getPickerLocale, handleLocaleChange } from '../../../core/routing';

export type LanguageSelectorSize = 'sm' | 'md' | 'lg';
export type LanguageSelectorVariant = 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow';

export interface LanguageOption {
  value: string;
  label: string;
}

export interface LanguageSelectorProps {
  /** Available language options */
  options?: LanguageOption[];
  /** Placeholder text when no language selected */
  placeholder?: string;
  /** Size of the selector */
  size?: LanguageSelectorSize;
  /** Visual variant */
  variant?: LanguageSelectorVariant;
  /** Component key for editing */
  componentKey?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  options = [],
  placeholder = 'Select Language',
  size = 'sm',
  variant = 'light',
  componentKey
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // Get current locale from pathname
  const currentLocale = getPickerLocale(pathname);
  const currentOption = options.find(opt => opt.value === currentLocale);

  return (
    <Menu
      size={size}
      variant={variant}
      closeOnSelect={true}
      componentKey={componentKey}
    >
      <Menu.Trigger>
        {currentOption?.label || placeholder}
      </Menu.Trigger>

      <Menu.Content>
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            value={option.value}
            onClick={() => handleLocaleChange(router, option.value)}
          >
            {option.label}
          </Menu.Item>
        ))}
      </Menu.Content>
    </Menu>
  );
};

export default LanguageSelector;
