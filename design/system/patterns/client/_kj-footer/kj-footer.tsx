'use client';

import { useState, useEffect } from 'react';
import { Typography } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Menu } from '../../../components/overlays/Menu';

interface FooterContent {
  companyName?: string;
  email?: string;
  copyright?: string;
  credits?: string;
  creditsLink?: string;
}

interface KjFooterProps {
  languageOptions?: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  isEditingMode?: boolean;
  content?: FooterContent;
}

const KjFooter = ({ languageOptions, isEditingMode = false, content }: KjFooterProps) => {
  const {
    companyName,
    email,
    copyright,
    credits,
    creditsLink
  } = content || {};

  const [selectedLanguage, setSelectedLanguage] = useState<string>('sv');

  const defaultLanguageOptions = [
    { value: 'sv', label: 'Svenska' },
    { value: 'en', label: 'English' }
  ];

  const options = languageOptions || defaultLanguageOptions;

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    
    if (pathSegments[0] === 'sv' || pathSegments[0] === 'en') {
      pathSegments.shift();
    }
    
    const newPath = `/${value}${pathSegments.length > 0 ? '/' + pathSegments.join('/') : ''}`;
    window.location.href = newPath;
  };

  useEffect(() => {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const currentLocale = pathSegments[0];
    
    if (currentLocale === 'sv' || currentLocale === 'en') {
      setSelectedLanguage(currentLocale);
    }
  }, []);

  const selectedLabel = options.find(opt => opt.value === selectedLanguage)?.label || 'Svenska';

  return (
    <VStack spacing="xl" align="center" fullWidth>
      {/* Title with Logo */}
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

      {/* Language Menu */}
      <Menu size="md">
        <Menu.Trigger>
          {selectedLabel}
        </Menu.Trigger>
        <Menu.Content>
          {options.map((option) => (
            <Menu.RadioItem
              key={option.value}
              value={option.value}
              checked={selectedLanguage === option.value}
              onSelect={() => handleLanguageChange(option.value)}
            >
              {option.label}
            </Menu.RadioItem>
          ))}
        </Menu.Content>
      </Menu>

      {/* Contact Info and Copyright */}
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
      
      {/* Credits */}
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
    </VStack>
  );
};

export default KjFooter;