'use client';

import { Picker } from '../../../../../system/components/primitives/Picker';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
import { Rhythm, RhythmItem } from '../../../../../system/layout/utilities/rhythm/Rhythm';
import { useState, useEffect } from 'react';
import { 
  getCurrentLocale, 
  createLanguageChangeHandler,
  switchLocale,
  defaultLocaleOptions,
  type SupportedLocale,
  type LocaleOption
} from '../../../../utils/locale';

// Import i18n messaging from the main design system export
import { 
  createI18nMessageHandlers,
  useI18nMessageListener,
  type I18nMessageHandlers
} from '../../../../..';

// Add a top-level log to verify this file is loaded
console.log('🌐 [KJ-FOOTER] FILE LOADED - kj-footer.tsx is being executed');
console.log('🌐 [KJ-FOOTER] TIMESTAMP:', new Date().toISOString(), '- This should help identify cache issues');

interface FooterContent {
  companyName?: string;
  email?: string;
  copyright?: string;
  credits?: string;
  creditsLink?: string;
}

interface KjFooterProps {
  // Optional override for language options if needed
  languageOptions?: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  // Editing mode passed from parent component
  isEditingMode?: boolean;
  // Content from CMS
  content?: FooterContent;
}

const KjFooter = ({ languageOptions, isEditingMode = false, content }: KjFooterProps) => {
  console.log('🌐 [KJ-FOOTER] COMPONENT CONSTRUCTOR - KjFooter component is being created');
  
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLocale>('sv');
  
  console.log('🌐 [KJ-FOOTER] Component rendered with isEditingMode:', isEditingMode);
  console.log('🌐 [KJ-FOOTER] typeof window:', typeof window);
  console.log('🌐 [KJ-FOOTER] window.addEventListener exists:', typeof window !== 'undefined' && typeof window.addEventListener === 'function');
  
  // Get current locale on component mount
  useEffect(() => {
    console.log('🌐 [KJ-FOOTER] MOUNT EFFECT - Component is mounting');
    const currentLocale = getCurrentLocale();
    console.log('🌐 [KJ-FOOTER] Setting initial locale to:', currentLocale);
    setSelectedLanguage(currentLocale);
  }, []);

  // Test: Add a general message listener to see if ANY postMessages are received
  useEffect(() => {
    console.log('🌐 [KJ-FOOTER] GENERAL MESSAGE LISTENER EFFECT - Setting up general message listener test...');
    
    const generalMessageHandler = (event: MessageEvent) => {
      console.log('🌐 [KJ-FOOTER] [GENERAL TEST] Received ANY postMessage:', event);
      console.log('🌐 [KJ-FOOTER] [GENERAL TEST] Event origin:', event.origin);
      console.log('🌐 [KJ-FOOTER] [GENERAL TEST] Event data:', event.data);
      console.log('🌐 [KJ-FOOTER] [GENERAL TEST] Event source:', event.source);
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('message', generalMessageHandler);
      console.log('🌐 [KJ-FOOTER] General message listener added successfully');
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', generalMessageHandler);
        console.log('🌐 [KJ-FOOTER] General message listener removed');
      }
    };
  }, []);

  // Create i18n message handlers for postMessage communication
  console.log('🌐 [KJ-FOOTER] About to create i18n handlers...');
  const i18nHandlers: I18nMessageHandlers = createI18nMessageHandlers({
    setSelectedLanguage: (language: string) => {
      console.log('🌐 [KJ-FOOTER] setSelectedLanguage called from postMessage with:', language);
      setSelectedLanguage(language as SupportedLocale);
    },
    isEditingMode
  });
  console.log('🌐 [KJ-FOOTER] i18n handlers created:', i18nHandlers);

  // Set up postMessage listener for language updates from parent editor
  console.log('🌐 [KJ-FOOTER] About to setup message listener...');
  useI18nMessageListener(i18nHandlers);
  console.log('🌐 [KJ-FOOTER] Message listener setup completed');

  // Extract content from props
  const {
    companyName,
    email,
    copyright,
    credits,
    creditsLink
  } = content || {};

  // Use provided language options or default ones with flag icons
  const options = languageOptions || defaultLocaleOptions.map((option: LocaleOption) => ({
    value: option.value,
    label: option.label,
    icon: option.flag ? <span className={option.flag} style={{ fontSize: '16px' }}></span> : undefined
  }));

  // Handle language change with proper typing for Picker component
  const handleLanguageChangeWithState = (value: string | null) => {
    if (value) {
      console.log('🌐 [KJ-FOOTER] handleLanguageChangeWithState called with:', { 
        value, 
        isEditingMode,
        currentLocale: selectedLanguage 
      });
      
      setSelectedLanguage(value as SupportedLocale);
      
      // Call switchLocale directly with the current isEditingMode value
      switchLocale(value as SupportedLocale, isEditingMode);
    }
  };

  return (
    <Rhythm unit="md" align="center" direction="column">
      {/* Title with Logo */}
      <RhythmItem at={1}>
        <Cluster spacing="md" align="center" justify="center">
          <img 
            src="/images/sections/kjlogo.jpg" 
            alt="KJ Marketing Sweden Logo"
            width={40}
            height={40}
            className="object-contain flex-shrink-0"
          />
          <Typography 
            variant="h4" 
            color="inverse" 
            align="center"
            weight="semibold"
          >
            {companyName}
          </Typography>
        </Cluster>
      </RhythmItem>

      {/* Language Picker */}
      <RhythmItem at={3}>
        <Picker
          options={options}
          value={selectedLanguage}
          onChange={handleLanguageChangeWithState}
          placeholder="Välj språk"
        />
      </RhythmItem>

      {/* Contact Info and Copyright */}
      <RhythmItem at={5}>
        <Stack spacing="xs" align="center">
          <Typography 
            variant="body-md" 
            color="tertiary" 
            align="center"
            weight="semibold"
          >
            <a 
              href={`mailto:${email}`}
              style={{ 
                color: 'inherit', 
                textDecoration: 'underline',
                textUnderlineOffset: '2px'
              }}
            >
              {email}
            </a>
          </Typography>
          <Typography 
            variant="body-sm" 
            color="tertiary" 
            align="center"
            weight="semibold"
          >
            {copyright}
          </Typography>
        </Stack>
      </RhythmItem>
      
      <RhythmItem at={7}>
        <Typography 
          variant="body-sm" 
          color="tertiary" 
          align="center"
          weight="semibold"
        >
          {credits}{' '}
          <Typography 
            variant="body-sm" 
            color="placeholder" 
            weight="bold"
            as="span"
          >
            <a 
              href="https://blimpify-im.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                color: 'inherit', 
                textDecoration: 'underline',
                textUnderlineOffset: '6px',
                textDecorationColor: 'var(--text-tertiary)'
              }}
            >
              {creditsLink}
            </a>
          </Typography>
        </Typography>
      </RhythmItem>
    </Rhythm>
  );
};

export default KjFooter;
