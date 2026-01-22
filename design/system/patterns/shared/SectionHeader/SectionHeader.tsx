'use client';

import React from 'react';
import { VStack } from '../../../components/layout/vStack/VStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../components/Typography/Typography';
import { Tag } from '../../../components/feedback/Tag/Tag';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, componentPresent } from '../../../core/utils/props';
import type { LayoutContext } from '../../../core/render/patterns';

export interface SectionHeaderProps extends PatternNode {
  type: 'sectionHeader';
  sectionKey?: string;
  patternKey?: string;
  /** Layout context for inheriting alignment from parent layout */
  layoutContext?: LayoutContext;
}

/**
 * SectionHeader Pattern - Renders tag, heading, and body text
 * Used as the main content block for sections
 *
 * Alignment priority:
 * 1. Explicit props.align / props.textAlign (highest priority)
 * 2. Inherited from layoutContext.alignSectionHeader
 * 3. Default to 'center'
 */
export const SectionHeader: React.FC<SectionHeaderProps> = (patternNode) => {
  const { components = {}, sectionKey, props, layoutContext } = patternNode;

  if (!components || Object.keys(components).length === 0) return null;

  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // Get inherited alignment from layout context
  const inheritedAlign = layoutContext?.alignSectionHeader;

  // Map layout alignment to component alignment values
  // 'left' -> 'start', 'right' -> 'end', 'center' -> 'center'
  const mapLayoutAlign = (layoutAlign?: string) => {
    if (layoutAlign === 'left') return 'start';
    if (layoutAlign === 'right') return 'end';
    return layoutAlign || 'center';
  };

  // Get spacing and alignment from pattern props, with inheritance fallback
  const spacing = props?.spacing || 'md';
  // Align controls the VStack/Box alignment (start/center/end)
  const align = props?.align || mapLayoutAlign(inheritedAlign);
  // TextAlign controls the Typography text alignment (left/center/right)
  const textAlign = props?.textAlign || inheritedAlign || 'center';
  const maxWidth = props?.maxWidth || '650px';
  const isHero = sectionKey?.startsWith('hero_') || props?.isHero || false;

  return (
    <Box
      style={{
        maxWidth: maxWidth,
        margin: align === 'center' ? '0 auto' : align === 'end' ? '0 0 0 auto' : '0 auto 0 0',
        width: '100%',
      }}
    >
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
    </Box>
  );
};

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
