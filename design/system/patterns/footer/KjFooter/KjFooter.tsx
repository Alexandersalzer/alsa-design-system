'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Typography } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Picker } from '../../../components/forms/Picker/Picker';
import { PatternNode } from '../../../core/types/nodes';
import { useComponentProps, componentPresent, CDN_BASE_URL } from '../../../core/utils/helpers';

const KjFooter = ({ components = {} }: PatternNode) => {
  const get = useComponentProps(components);
  const renderIf = componentPresent(components);
  const pathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState<string>('sv');

  // Extract locale from pathname
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    const localeFromPath = segments[0];
    
    // Check if first segment is a valid locale
    if (localeFromPath === 'sv' || localeFromPath === 'en') {
      setCurrentLocale(localeFromPath);
    } else {
      setCurrentLocale('sv'); // Default fallback
    }
  }, [pathname]);

  // Handle language change
  const handleLanguageChange = (value: string | null) => {
    if (value && (value === 'sv' || value === 'en')) {
      console.log('Language changed to:', value);
      
      // Get current path without locale
      const segments = pathname.split('/').filter(Boolean);
      const pathWithoutLocale = segments.slice(1).join('/');
      
      // Build new path with new locale
      const newPath = `/${value}${pathWithoutLocale ? '/' + pathWithoutLocale : ''}`;
      
      // Navigate to new locale
      router.push(newPath);
    }
  };
  
  return (
    <VStack spacing="xl" align="center" fullWidth>
      {/* Title with Logo */}
      <HStack spacing="md" align="center" justify="center">
        {renderIf('logo') && (
          <img
            src={`${CDN_BASE_URL}${get('logo').src}`}
            alt={get('logo').alt || 'Logo'}
            width={get('logo').width || 40}
            height={get('logo').height || 40}
            className="object-contain flex-shrink-0"
          />
        )}
        <Typography 
          variant="h4" 
          color="inverse" 
          align="center"
          weight="semibold"
        >
          {get('typography', 'title').content}
        </Typography>
      </HStack>

      {/* Language Picker */}
      {renderIf('picker', 'languageSelector') && (
        <Picker
          placeholder={get('picker', 'languageSelector').placeholder}
          size={get('picker', 'languageSelector').size}
          variant={get('picker', 'languageSelector').variant}
          options={get('picker', 'languageSelector').options || []}
          value={currentLocale}
          onChange={handleLanguageChange}
        />
      )}

      {/* Body Content */}
      <VStack spacing="xs" align="center">
        {/* Email */}
        <Typography 
          variant="body-md"
          color="tertiary" 
          align="center"
          weight="semibold"
        >
          <a 
            href={`mailto:${get('typography', 'email').content}`}
            style={{ 
              color: 'inherit', 
              textDecoration: 'underline',
              textUnderlineOffset: '2px'
            }}
          >
            {get('typography', 'email').content}
          </a>
        </Typography>
        
        {/* Legal */}
        <Typography 
          variant="body-sm"
          color="tertiary" 
          align="center"
          weight="semibold"
        >
          {get('typography', 'legal').content}
        </Typography>
      </VStack>
      {/* Attribution */}
        <Typography 
          variant="body-sm"
          color="tertiary" 
          align="center"
          weight="semibold"
        >
          {get('typography', 'attribute').content}{' '}
          <a 
            href="https://blimpify-im.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              color: 'var(--text-placeholder)', 
              textDecoration: 'underline',
              textUnderlineOffset: '6px',
              fontWeight: 'bold'
            }}
          >
            Blimpify
          </a>
        </Typography>
    </VStack>
  );
};

export default KjFooter;