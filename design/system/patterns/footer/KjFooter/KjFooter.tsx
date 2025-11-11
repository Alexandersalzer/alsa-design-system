'use client';

import { Typography } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { PatternNode } from '../../../core/types/nodes';
import { getContentByRole } from '../../../core/utils/helpers';

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
          weight="semibold"
        >
          {getContentByRole(components, 'title')}
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
            href={`mailto:${getContentByRole(components, 'email')}`}
            style={{ 
              color: 'inherit', 
              textDecoration: 'underline',
              textUnderlineOffset: '2px'
            }}
          >
            {getContentByRole(components, 'email')}
          </a>
        </Typography>
        
        {/* Legal */}
        <Typography 
          variant="body-sm"
          color="tertiary" 
          align="center"
          weight="semibold"
        >
          {getContentByRole(components, 'legal')}
        </Typography>
        
        {/* Attribution */}
        <Typography 
          variant="body-sm"
          color="tertiary" 
          align="center"
          weight="semibold"
        >
          {getContentByRole(components, 'attribute').includes('Blimpify-IM') ? (
            <>
              {getContentByRole(components, 'attribute').replace('Blimpify-IM', '')}{' '}
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
            getContentByRole(components, 'attribute')
          )}
        </Typography>
      </VStack>
    </VStack>
  );
};

export default KjFooter;