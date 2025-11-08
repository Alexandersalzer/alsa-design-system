'use client';

import { Typography } from '../../../components/Typography';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';

interface KjFooterProps {
  type?: string;
  props?: Record<string, any>;
  components?: Record<string, {
    type: string;
    props: Record<string, any>;
  }>;
}

const KjFooter = ({ type, props, components = {} }: KjFooterProps) => {
  // Extract content from new components structure
  const componentsList = Object.values(components);
  const title = componentsList.find(c => c.type === 'title')?.props?.content || 'KJ MARKETING SWEDEN';
  const bodies = componentsList.filter(c => c.type === 'body').map(c => c.props?.content || '');

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
          {title}
        </Typography>
      </HStack>

      {/* Body Content */}
      <VStack spacing="xs" align="center">
        {bodies.map((body, index) => (
          <Typography 
            key={index}
            variant={index === 0 ? "body-md" : "body-sm"}
            color="tertiary" 
            align="center"
            weight="semibold"
          >
            {body.includes('@') ? (
              <a 
                href={`mailto:${body}`}
                style={{ 
                  color: 'inherit', 
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px'
                }}
              >
                {body}
              </a>
            ) : body.includes('Blimpify-IM') ? (
              <>
                {body.replace('Blimpify-IM', '')}{' '}
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
              body
            )}
          </Typography>
        ))}
      </VStack>
    </VStack>
  );
};

export default KjFooter;