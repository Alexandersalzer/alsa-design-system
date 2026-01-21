'use client';

import { Container } from '../../components/frames/container/Container';
import { VStack } from '../../components/layout/vStack/VStack';
import { Box } from '../../components/layout/box/Box';
import { Typography } from '../../components/Typography/Typography';
import { Tag } from '../../components/feedback/Tag/Tag';
import { SectionNode } from '../types/nodes';
import { componentProps, componentPresent } from '../utils/props';

/**
 * Renders section header (tag, heading, body) if it exists
 */
export function SectionHeader(
  header: SectionNode['header'], 
  sectionKey: string, 
  sectionProps: Record<string, any>
) {
  if (!header?.components) return null;

  const components = header.components;
  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // Get spacing and hero detection from section props
  const spacing = sectionProps?.spacing || 'md';
  const isHero = sectionKey?.startsWith('hero_') || sectionProps?.isHero || false;

  return (
    <Container height="auto" useMediaWidth={false}>
      <Box
        style={{
          maxWidth: '650px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <VStack spacing={spacing} align="center">
          
          {/* Tag - optional */}
          {renderIf('tag') && get('tag').props.content && (
            <Box>
              <Tag
                size="medium"
                variant="accent"
                icon={null}
                componentKey={get('tag').key}
              >
                {get('tag').props.content}
              </Tag>
            </Box>
          )}

          {/* Heading - hardcoded */}
          {renderIf('heading') && get('heading').props.content && (
            <Typography
              as={isHero ? "h1" : "h2"}
              variant="display-lg"
              color="heading"
              align="center"
              animation={get('heading').props.animation}
              componentKey={get('heading').key}
            >
              {get('heading').props.content}
            </Typography>
          )}

          {/* Body - hardcoded */}
          {renderIf('body') && get('body').props.content && (
            <Typography
              as="p"
              variant="body-lg"
              color="body"
              weight="regular"
              align="center"
              animation={get('body').props.animation}
              componentKey={get('body').key}
            >
              {get('body').props.content}
            </Typography>
          )}

        </VStack>
      </Box>
    </Container>
  );
}
