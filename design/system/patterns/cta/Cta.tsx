// ===============================================
// design/system/patterns/cta/Cta.tsx
// CTA PATTERN - Call-to-Action section with card styling support
// Uses Card component for consistent styling
// ===============================================

'use client';

import React from 'react';
import { PatternNode } from '../../core/types/nodes';
import { patternProps, componentProps, componentPresent } from '../../core/utils/props';
import { Card } from '../../components/layout/Card/Card';
import { VStack } from '../../components/layout/vStack/VStack';
import { Typography } from '../../components/Typography/Typography';
import { Button } from '../../components/actions/Button/Button';
import './Cta.css';

export interface CtaProps extends PatternNode {
  type: 'cta';
}

export const Cta: React.FC<CtaProps> = (patternNode) => {
  const getPatternProps = patternProps(patternNode);
  const { components = {} } = patternNode;
  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // Extract pattern props with defaults
  const {
    variant = 'default', // 'default' | 'raised' | 'elevated' | 'outlined' | 'solid' | 'ghost'
    padding = 'lg', // 'none' | 'xs' | 'sm' | 'md' | 'lg'
    radius = 'lg', // 'sm' | 'md' | 'lg'
    maxWidth = 'full', // 'auto' | 'constrained' | 'compact' | 'spacious' | 'full'
    textAlign = 'center', // 'left' | 'center' | 'right'
    spacing = 'md', // VStack spacing
  } = getPatternProps();

  // Map maxWidth prop to Card width prop (if not 'full')
  const cardWidth = maxWidth === 'full' ? 'auto' : maxWidth;

  // Map text alignment to VStack align
  const alignMap = {
    left: 'start',
    center: 'center',
    right: 'end',
  } as const;
  const vStackAlign = alignMap[textAlign as keyof typeof alignMap] || 'center';

  // Build CSS classes for text alignment
  const ctaClasses = `cta cta--align-${textAlign}`;

  return (
    <div className={ctaClasses}>
      <Card
        variant={variant}
        padding={padding}
        radius={radius}
        width={cardWidth}
      >
        <VStack spacing={spacing} align={vStackAlign}>
          {/* Heading */}
          {renderIf('typography-heading') && get('typography-heading').props.content && (
            <Typography
              as="h2"
              variant="display-lg"
              color="heading"
              align={textAlign}
              componentKey={get('typography-heading').key}
            >
              {get('typography-heading').props.content}
            </Typography>
          )}

          {/* Body Text */}
          {renderIf('typography-body') && get('typography-body').props.content && (
            <Typography
              as="p"
              variant="body-lg"
              color="body"
              weight="regular"
              align={textAlign}
              componentKey={get('typography-body').key}
            >
              {get('typography-body').props.content}
            </Typography>
          )}

          {/* Primary Button */}
          {renderIf('button-primary') && get('button-primary').props.content && (
            <Button
              size="lg"
              variant="accent"
              href={get('button-primary').props.href}
              action={get('button-primary').props.action}
              componentKey={get('button-primary').key}
            >
              {get('button-primary').props.content}
            </Button>
          )}
        </VStack>
      </Card>
    </div>
  );
};
