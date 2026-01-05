// ===============================================
// LOCATION: design/system/patterns/footer/Placeholder/Placeholder.tsx
// Placeholder Footer Pattern - Simple "powered by Blimpify" footer
// ===============================================
'use client';

import { Typography, HStack } from '../../../components';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, componentPresent } from '../../../core/utils/props';

interface PlaceholderProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

const Placeholder = ({ components = {}, sectionKey, patternKey }: PlaceholderProps) => {
  const get = componentProps(components);
  const renderIf = componentPresent(components);

  return (
    <HStack 
      spacing="xs" 
      align="center" 
      justify="center"
    >
      {renderIf('typography-text') && get('typography-text').props.content && (
        <Typography
          as="p"
          variant="body-sm"
          color="tertiary"
          weight="semibold"
          align="center"
          componentKey={get('typography-text').key}
        >
          {get('typography-text').props.content}{' '}
          <a 
            href={get('typography-link')?.props?.href || 'https://blimpify-im.com'}
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
      )}
    </HStack>
  );
};

Placeholder.displayName = 'Placeholder';

export default Placeholder;
