'use client';

import { Picker } from '@/design/system/components/primitives/Picker';
import { Typography } from '@/design/system/components/primitives/Typography';
import { Stack } from '@/design/system/layout/utilities/stack/Stack';
import { Cluster } from '@/design/system/layout/utilities/cluster/Cluster';
import { Rhythm, RhythmItem } from '@/design/system/layout/utilities/rhythm/Rhythm';
import { useState } from 'react';

const KjFooter = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('sv');

  const languageOptions = [
    {
      value: 'sv',
      label: 'Svenska',
      icon: <span className="fi fi-se" style={{ fontSize: '16px' }}></span>
    },
    {
      value: 'en',
      label: 'English',
      icon: <span className="fi fi-gb" style={{ fontSize: '16px' }}></span>
    }
  ];

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      setSelectedLanguage(value);
      // Here you can add logic to change the actual language
      console.log('Language changed to:', value);
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
          options={languageOptions}
          value={selectedLanguage}
          onChange={handleLanguageChange}
          placeholder="Välj språk"
          variant="footer"
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
