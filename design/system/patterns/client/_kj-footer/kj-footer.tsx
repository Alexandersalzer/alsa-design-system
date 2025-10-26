'use client';

import { useState, useEffect } from 'react';
import { Typography } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Rhythm, RhythmItem } from '../../../components/layout/rhythm/Rhythm';
import { Picker } from '../../../components';

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
  // Extract content from props
  const {
    companyName,
    email,
    copyright,
    credits,
    creditsLink
  } = content || {};

  const [selectedLanguage, setSelectedLanguage] = useState<string>('sv');

  // Default language options
  const defaultLanguageOptions = [
    { value: 'sv', label: 'Svenska' },
    { value: 'en', label: 'English' }
  ];

  const options = languageOptions || defaultLanguageOptions;

  // Handle language change
  const handleLanguageChange = (value: string | null) => {
    if (value) {
      setSelectedLanguage(value);
      
      // Get current path and switch language
      const currentPath = window.location.pathname;
      const pathSegments = currentPath.split('/').filter(Boolean);
      
      // Remove current locale if present
      if (pathSegments[0] === 'sv' || pathSegments[0] === 'en') {
        pathSegments.shift();
      }
      
      // Build new path with selected language
      const newPath = `/${value}${pathSegments.length > 0 ? '/' + pathSegments.join('/') : ''}`;
      
      // Navigate to new path
      window.location.href = newPath;
    }
  };

  // Get current locale from URL
  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const currentLocale = pathSegments[0];
    
    if (currentLocale === 'sv' || currentLocale === 'en') {
      setSelectedLanguage(currentLocale);
    }
  }, []);

  return (
    <Rhythm unit="md" align="center" direction="column">
      {/* Title with Logo */}
      <RhythmItem at={1}>
        <HStack spacing="md" align="center" justify="center">
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
        </HStack>
      </RhythmItem>

      {/* Language Picker */}
      <RhythmItem at={3}>
        <Picker
          options={options}
          value={selectedLanguage}
          onChange={handleLanguageChange}
          placeholder="Välj språk"
          size="md"
          variant="compact"
        />
      </RhythmItem>

      {/* Contact Info and Copyright */}
      <RhythmItem at={5}>
        <VStack spacing="xs" align="center">
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
        </VStack>
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
