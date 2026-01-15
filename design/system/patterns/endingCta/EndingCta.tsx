// ===============================================
// design/system/patterns/endingCta/EndingCta.tsx
// ENDING CTA PATTERN - Action group (button(s) only, no text content)
// Use this for standalone buttons/actions at the end of sections
// ===============================================

'use client';

import React from 'react';
import { PatternNode } from '../../core/types/nodes';
import { patternProps, componentProps, componentPresent } from '../../core/utils/props';
import { HStack } from '../../components/layout/hStack/HStack';
import { Button } from '../../components/actions/Button/Button';
import './EndingCta.css';

export interface EndingCtaProps extends PatternNode {
  type: 'endingCta';
}

export const EndingCta: React.FC<EndingCtaProps> = (patternNode) => {
  const getPatternProps = patternProps(patternNode);
  const { components = {} } = patternNode;
  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // Extract pattern props with defaults
  const {
    align = 'center', // 'left' | 'center' | 'right'
    gap = 'md', // HStack gap between buttons
    wrap = true, // Allow buttons to wrap on mobile
  } = getPatternProps();

  // Map align to HStack justify
  const justifyMap = {
    left: 'start',
    center: 'center',
    right: 'end',
  } as const;
  const justify = justifyMap[align as keyof typeof justifyMap] || 'center';

  // Build CSS classes
  const endingCtaClasses = `ending-cta ending-cta--align-${align}`;

  return (
    <div className={endingCtaClasses}>
      <HStack
        spacing={gap}
        justify={justify}
        align="center"
        wrap={wrap}
        className="ending-cta__button-group"
      >
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

        {/* Secondary Button */}
        {renderIf('button-secondary') && get('button-secondary').props.content && (
          <Button
            size="lg"
            variant="secondary"
            href={get('button-secondary').props.href}
            action={get('button-secondary').props.action}
            componentKey={get('button-secondary').key}
          >
            {get('button-secondary').props.content}
          </Button>
        )}

        {/* Ghost Button */}
        {renderIf('button-ghost') && get('button-ghost').props.content && (
          <Button
            size="lg"
            variant="ghost"
            href={get('button-ghost').props.href}
            action={get('button-ghost').props.action}
            componentKey={get('button-ghost').key}
          >
            {get('button-ghost').props.content}
          </Button>
        )}
      </HStack>
    </div>
  );
};

EndingCta.displayName = 'EndingCta';
