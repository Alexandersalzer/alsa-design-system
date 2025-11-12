'use client';

import { Typography } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Picker } from '../../../components/forms/Picker/Picker';
import { PatternNode } from '../../../core/types/nodes';
import { useComponentProps, componentPresent, CDN_BASE_URL } from '../../../core/utils/helpers';
import { useLocaleSwitch } from '../../../hooks/useLocaleSwitch';

const KjFooter = ({ components = {} }: PatternNode) => {
  const get = useComponentProps(components);
  const renderIf = componentPresent(components);
  const { switchToLocale, getCurrentLocale } = useLocaleSwitch();
  
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
          value={getCurrentLocale()}
          onChange={(value) => {
            if (value) {
              switchToLocale(value);
            }
          }}
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