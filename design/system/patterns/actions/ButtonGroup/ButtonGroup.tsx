// ===============================================
// ButtonGroup Pattern Component
// Renders multiple buttons in a horizontal group
// ===============================================

'use client';

import React from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, componentProps, componentPresent } from '../../../core/utils/props';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Button } from '../../../components/actions/Button/Button';

export interface ButtonGroupProps extends PatternNode {
  type: 'buttonGroup';
}

export const ButtonGroup: React.FC<ButtonGroupProps> = (patternNode) => {
  const getPatternProps = patternProps(patternNode);
  const { components = {}, order = [] } = patternNode;
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

  // Fallback: if no order, use all component keys
  const buttonKeys = order.length > 0 ? order : Object.keys(components);

  return (
    <HStack
      spacing={gap}
      justify={justify}
      align="center"
      wrap={wrap}
    >
      {buttonKeys.map((buttonKey) => {
        const button = components[buttonKey];
        if (!button || button.type !== 'button' || !button.props.content) return null;

        return (
          <Button
            key={buttonKey}
            size={button.props.size || 'lg'}
            variant={button.props.variant || 'accent'}
            href={button.props.href}
            action={button.props.action}
            componentKey={button.componentKey || buttonKey}
          >
            {button.props.content}
          </Button>
        );
      })}
    </HStack>
  );
};

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
