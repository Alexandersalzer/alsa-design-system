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

// Import i18n context from EditingWrapper
import { useI18nContext } from '../../../../../cms/wrappers/editing';

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
  
  // Try to use i18n context from EditingWrapper if available (in iframe)
  let contextLanguage: string | null = null;
  try {
    const i18nContext = useI18nContext();
    contextLanguage = i18nContext.currentLanguage;
  } catch (error) {
    // useI18nContext not available - we're not in iframe context
    console.log('🌍 Footer: Not in iframe context, using direct locale switching');
  }

  // Get current locale on component mount and sync with context
  useEffect(() => {
    if (contextLanguage) {
      // In iframe context - use language from I18n context
      console.log('🌍 Footer: Using language from i18n context:', contextLanguage);
      setSelectedLanguage(contextLanguage as SupportedLocale);
    } else {
      // Not in iframe context - use direct locale detection
      const currentLocale = getCurrentLocale();
      setSelectedLanguage(currentLocale);
    }
  }, [contextLanguage]);

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
        isEditingMode,
        contextLanguage,
        currentLocale: selectedLanguage 
      });
      
      setSelectedLanguage(value as SupportedLocale);
      
      // Only switch locale if we're not in iframe context (to avoid conflicts)
      if (!contextLanguage) {
        console.log('🌍 Footer: Direct locale switching (not in iframe)');
        switchLocale(value as SupportedLocale, isEditingMode);
      } else {
        console.log('🌍 Footer: In iframe context - language change handled by parent');
        // In iframe context, language switching is handled by postMessage from parent
        // We just update our local state to reflect the change
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

      {/* Language Picker - Only show if not in iframe context to avoid conflicts */}
      {!contextLanguage && (
        <RhythmItem at={3}>
          <Picker
            options={options}
            value={selectedLanguage}
            onChange={handleLanguageChangeWithState}
            placeholder="Välj språk"
          />
        </RhythmItem>
      )}

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
