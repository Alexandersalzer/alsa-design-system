// ===============================================
// design/system/patterns/cta/Cta.tsx
// CTA PATTERN - Call-to-Action section with card styling support
// ===============================================

'use client';

import React from 'react';
import { PatternNode } from '../../core/types/nodes';
import { patternProps, componentProps, componentPresent } from '../../core/utils/props';
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
    variant = 'default', // 'default' | 'card' | 'elevated'
    surface = 'subtle', // 'base' | 'subtle' | 'raised' | 'elevated' | 'accent'
    radius = 'lg', // 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    padding = 'xl', // 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    textAlign = 'center', // 'left' | 'center' | 'right'
    maxWidth = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'full'
    spacing = 'md', // VStack spacing
  } = getPatternProps();

  // Build CSS classes
  const ctaClasses = [
    'cta',
    `cta--variant-${variant}`,
    `cta--surface-${surface}`,
    `cta--radius-${radius}`,
    `cta--padding-${padding}`,
    `cta--align-${textAlign}`,
    `cta--max-width-${maxWidth}`,
  ].join(' ');

  return (
    <div className={ctaClasses}>
      <div className="cta__content">
        <VStack spacing={spacing} align="center">
          {/* Heading */}
          {renderIf('typography-heading') && get('typography-heading').props.content && (
            <Typography
              as="h2"
              variant="display-lg"
              color="heading"
              align="center"
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
              align="center"
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
      </div>
    </div>
  );
};
