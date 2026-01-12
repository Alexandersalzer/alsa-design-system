// ===============================================
// design/system/patterns/cta/Cta.tsx
// CTA PATTERN - Call-to-Action section with card styling support
// ===============================================

'use client';

import React from 'react';
import { PatternNode } from '../../core/types/nodes';
import { patternProps, componentProps, getPatternOrder } from '../../core/utils/props';
import { SectionBody } from '../shared/sectionBody/SectionBody';
import './Cta.css';

export interface CtaProps extends PatternNode {
  type: 'cta';
}

export const Cta: React.FC<CtaProps> = (patternNode) => {
  const getPatternProps = patternProps(patternNode);
  const { components = {} } = patternNode;
  const componentOrder = getPatternOrder(patternNode);

  // Extract pattern props with defaults
  const {
    variant = 'default', // 'default' | 'card' | 'elevated'
    surface = 'subtle', // 'base' | 'subtle' | 'raised' | 'elevated' | 'accent'
    radius = 'lg', // 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
    padding = 'xl', // 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    textAlign = 'center', // 'left' | 'center' | 'right'
    maxWidth = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'full'
  } = getPatternProps();

  // Get sectionBody pattern (should be the first/only pattern)
  const sectionBodyKey = componentOrder[0];
  const sectionBodyPattern = components[sectionBodyKey];

  if (!sectionBodyPattern || sectionBodyPattern.type !== 'sectionBody') {
    console.warn('[Cta] No sectionBody pattern found');
    return null;
  }

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
        <SectionBody {...sectionBodyPattern} />
      </div>
    </div>
  );
};
