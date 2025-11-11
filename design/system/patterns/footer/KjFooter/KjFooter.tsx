'use client';

import { Typography } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { PatternNode } from '../../../core/types/nodes';
import { getComponentProps } from '../../../core/utils/helpers';

const KjFooter = ({ components = {} }: PatternNode) => {
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
          weight={getComponentProps(components, 'typography', 'title').weight || 'semibold'}
        >
          {getComponentProps(components, 'typography', 'title').content}
        </Typography>
      </HStack>

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
            href={`mailto:${getComponentProps(components, 'typography', 'email').content}`}
            style={{ 
              color: 'inherit', 
              textDecoration: 'underline',
              textUnderlineOffset: '2px'
            }}
          >
            {getComponentProps(components, 'typography', 'email').content}
          </a>
        </Typography>
        
        {/* Legal */}
        <Typography 
          variant="body-sm"
          color="tertiary" 
          align="center"
          weight="semibold"
        >
          {getComponentProps(components, 'typography', 'legal').content}
        </Typography>
      </VStack>
      {/* Attribution */}
        <Typography 
          variant="body-sm"
          color="tertiary" 
          align="center"
          weight="semibold"
        >
          {getComponentProps(components, 'typography', 'attribute').content.includes('Blimpify-IM') ? (
            <>
              {getComponentProps(components, 'typography', 'attribute').content.replace('Blimpify-IM', '')}{' '}
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
                Blimpify-IM
              </a>
            </>
          ) : (
            getComponentProps(components, 'typography', 'attribute').content
          )}
        </Typography>
    </VStack>
  );
};

export default KjFooter;