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
import { useEditingMode } from '../../../../../cms/wrappers/editing/EditingWrapper';
import { setupBasicLocaleSynchronization } from '../../../../../cms/messaging/i18n/child';

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
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLocale>('sv');
  const { isEditingMode: contextIsEditingMode } = useEditingMode();
  
  // Use context editing mode if available, otherwise fall back to prop
  const actualIsEditingMode = contextIsEditingMode !== undefined ? contextIsEditingMode : isEditingMode;
  
  // Get current locale on component mount
  useEffect(() => {
    const currentLocale = getCurrentLocale();
    setSelectedLanguage(currentLocale);
  }, []);

  // Setup postMessage listener for locale synchronization in editing mode
  useEffect(() => {
    if (actualIsEditingMode) {
      console.log('🌐 KjFooter setting up locale synchronization in editing mode');
      
      const cleanup = setupBasicLocaleSynchronization((locale: string) => {
        console.log('🌐 KjFooter received locale change from parent:', locale);
        setSelectedLanguage(locale as SupportedLocale);
        
        // Also trigger the actual locale switch
        switchLocale(locale as SupportedLocale, actualIsEditingMode);
      });

      return cleanup;
    }
  }, [actualIsEditingMode]);

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
      console.log('Footer language change debug:', { 
        value, 
        isEditingMode: actualIsEditingMode,
        currentLocale: selectedLanguage 
      });
      
      setSelectedLanguage(value as SupportedLocale);
      
      // In editing mode, don't trigger switchLocale directly since parent controls it
      // In non-editing mode, trigger switchLocale as before
      if (!actualIsEditingMode) {
        switchLocale(value as SupportedLocale, actualIsEditingMode);
      } else {
        console.log('🌐 In editing mode - parent controls locale switching');
      }
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
