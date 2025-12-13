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
          color="body"
          weight="regular"
          align="center"
          componentKey={get('typography-text').key}
        >
          {get('typography-text').props.content}{' '}
          {renderIf('typography-link') && get('typography-link').props.content && (
            <a
              href={get('typography-link').props.href || 'https://blimpify.com'}
              target="_blank"
              rel="noopener noreferrer"
              data-component-key={get('typography-link').key}
            >
              {get('typography-link').props.content}
            </a>
          )}
        </Typography>
      )}
    </HStack>
  );
};

Placeholder.displayName = 'Placeholder';

export default Placeholder;
