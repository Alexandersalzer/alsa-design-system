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

interface KjFooterProps {
  // Optional override for language options if needed
  languageOptions?: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  // Editing mode passed from parent component
  isEditingMode?: boolean;
}

const KjFooter = ({ languageOptions, isEditingMode = false }: KjFooterProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLocale>('sv');
  
  // Get current locale on component mount
  useEffect(() => {
    const currentLocale = getCurrentLocale();
    setSelectedLanguage(currentLocale);
  }, []);

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
            KJ MARKETING SWEDEN
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
              href="mailto:info@kjmarketingsweden.com"
              style={{ 
                color: 'inherit', 
                textDecoration: 'underline',
                textUnderlineOffset: '2px'
              }}
            >
              info@kjmarketingsweden.com
            </a>
          </Typography>
          <Typography 
            variant="body-sm" 
            color="tertiary" 
            align="center"
            weight="semibold"
          >
            © KJ MARKETING SWEDEN AB 559528-9629 2018–2025. All rights reserved
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
          En hemsida skapad av{' '}
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
              Blimpify-IM
            </a>
          </Typography>
        </Typography>
      </RhythmItem>
    </Rhythm>
  );
};

export default KjFooter;
