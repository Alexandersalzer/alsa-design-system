'use client';

import React from 'react';
import { VStack } from '../../../components/layout/vStack/VStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../components/Typography/Typography';
import { Tag } from '../../../components/feedback/Tag/Tag';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, componentPresent } from '../../../core/utils/props';

export interface SectionHeaderProps extends PatternNode {
  type: 'sectionHeader';
  sectionKey?: string;
  patternKey?: string;
}

/**
 * SectionHeader Pattern - Renders tag, heading, and body text
 * Used as the main content block for sections
 */
export const SectionHeader: React.FC<SectionHeaderProps> = (patternNode) => {
  const { components = {}, sectionKey, props } = patternNode;
  
  if (!components || Object.keys(components).length === 0) return null;

  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // Get spacing and alignment from pattern props
  const spacing = props?.spacing || 'md';
  const align = props?.align || 'center';
  const textAlign = props?.textAlign || 'center';
  const maxWidth = props?.maxWidth || '650px';
  const isHero = sectionKey?.startsWith('hero_') || props?.isHero || false;

  return (
    <VStack spacing={spacing} align={align === 'center' ? 'center' : 'start'}>
        
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

        {/* Heading - render if content OR animation exists (countUp generates content) */}
        {renderIf('heading') && (get('heading').props.content || get('heading').props.animation) && (
          <Typography
            as={isHero ? "h1" : "h2"}
            variant="display-lg"
            color="heading"
            align={textAlign}
            animation={get('heading').props.animation}
            componentKey={get('heading').key}
          >
            {get('heading').props.content}
          </Typography>
        )}

        {/* Body - optional */}
        {renderIf('body') && get('body').props.content && (
          <Typography
            as="p"
            variant="body-lg"
            color="body"
            weight="regular"
            align={textAlign}
            animation={get('body').props.animation}
            componentKey={get('body').key}
          >
            {get('body').props.content}
          </Typography>
        )}

      </VStack>
  );
};

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
