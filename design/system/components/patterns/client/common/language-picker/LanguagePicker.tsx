'use client';

import { useState, useEffect } from 'react';
import { Picker } from '../../../../primitives/Picker';
import { 
  getCurrentLocale, 
  switchLocale,
  defaultLocaleOptions,
  type SupportedLocale,
  type LocaleOption
} from '../../../../../utils/locale';
import { 
  createI18nMessageHandlers,
  useI18nMessageListener,
  sendLanguageUpdateToParent 
} from '../../../../../../index';
import { type LanguagePickerProps } from './types';

export const LanguagePicker: React.FC<LanguagePickerProps> = ({
  size = 'md',
  variant = 'compact',
  placeholder = 'Välj språk',
  className,
  languageOptions,
  isEditingMode = false,
  enablePostMessageSync = false,
  onLanguageChange,
  value: controlledValue,
  onChange: controlledOnChange
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLocale>('sv');
  
  // Determine if this is controlled mode
  const isControlled = controlledValue !== undefined && controlledOnChange !== undefined;
  const currentValue = isControlled ? controlledValue : selectedLanguage;

  // Get current locale on component mount (only for uncontrolled mode)
  useEffect(() => {
    if (!isControlled) {
      const currentLocale = getCurrentLocale();
      setSelectedLanguage(currentLocale);
    }
  }, [isControlled]);

  // Create i18n message handlers for postMessage communication (only if enabled)
  const i18nHandlers = enablePostMessageSync ? createI18nMessageHandlers({
    setSelectedLanguage: (languageCode: string) => {
      console.log('🌐 LanguagePicker received language update from parent:', languageCode);
      if (isControlled) {
        // In controlled mode, let parent handle the state
        controlledOnChange?.(languageCode);
      } else {
        setSelectedLanguage(languageCode as SupportedLocale);
      }
    },
    isEditingMode
  }) : null;

  // Setup i18n message listener (only if postMessage sync is enabled)
  if (enablePostMessageSync && i18nHandlers) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useI18nMessageListener(i18nHandlers);
  }

  // Prepare language options with flag icons
  const options = languageOptions || defaultLocaleOptions.map((option: LocaleOption) => ({
    value: option.value,
    label: option.label,
    icon: option.flag ? <span className={option.flag} style={{ fontSize: '16px' }}></span> : undefined
  }));

  // Handle language change
  const handleLanguageChange = (value: string | null) => {
    if (value) {
      console.log('LanguagePicker language change:', { 
        value, 
        isEditingMode,
        enablePostMessageSync,
        currentLocale: currentValue 
      });
      
      // Update state (controlled or uncontrolled)
      if (isControlled) {
        controlledOnChange?.(value);
      } else {
        setSelectedLanguage(value as SupportedLocale);
      }
      
      // Call custom callback if provided
      onLanguageChange?.(value);
      
      // If postMessage sync is enabled and in editing mode, notify parent
      if (enablePostMessageSync && isEditingMode) {
        console.log('🌐 Notifying parent of language change (editing mode):', value);
        sendLanguageUpdateToParent(value);
        
        // In editing mode with postMessage sync, DON'T change URL
        // Parent will handle content fetching and updates via postMessage
        console.log('🌐 Skipping URL change in editing mode - parent handles content via postMessage');
        return;
      }
      
      // Only switch locale if NOT in editing mode or postMessage sync is disabled
      // The isEditingMode parameter ensures proper URL handling (with .html extension)
      switchLocale(value as SupportedLocale, isEditingMode);
    }
  };

  return (
    <Picker
      options={options}
      value={currentValue}
      onChange={handleLanguageChange}
      placeholder={placeholder}
      size={size}
      variant={variant}
      className={className}
    />
  );
};

export default LanguagePicker; 