// ===============================================
// LOCATION: design/system/patterns/footer/Placeholder/Placeholder.tsx
// Placeholder Footer Pattern - Simple "powered by Blimpify" footer
// ===============================================
'use client';

import { Typography, HStack } from '../../../components';
import { PatternNode } from '../../../core/types/nodes';

interface PlaceholderProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
  locale?: string;
}

// Språkschema för footer-texten
const translations: Record<string, string> = {
  'sv': 'Webbplatsen är utvecklad av',
  'en': 'This site is powered by',
  'no': 'Nettstedet er utviklet av',
  'da': 'Hjemmesiden er udviklet af',
  'fi': 'Sivusto on kehittänyt',
  'de': 'Diese Website wird betrieben von',
  'es': 'Este sitio está desarrollado por',
  'fr': 'Ce site est développé par',
};

const Placeholder = ({ locale = 'sv', sectionKey, patternKey }: PlaceholderProps) => {
  const text = translations[locale] || translations['sv'];

  return (
    <HStack 
      spacing="xs" 
      align="center" 
      justify="center"
    >
      <Typography
        as="p"
        variant="body-sm"
        color="tertiary"
        weight="semibold"
        align="center"
      >
        {text}{' '}
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
    </HStack>
  );
};

Placeholder.displayName = 'Placeholder';

export default Placeholder;
