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

  return (
    <HStack
      spacing={gap}
      justify={justify}
      align="center"
      wrap={wrap}
    >
      {/* Primary Button */}
      {renderIf('button-primary') && (
        <Button
          size={get('button-primary').props.size || 'lg'}
          variant={get('button-primary').props.variant || 'accent'}
          href={get('button-primary').props.href}
          action={get('button-primary').props.action}
          rightIcon={get('button-primary').props.rightIcon}
          leftIcon={get('button-primary').props.leftIcon}
          componentKey={get('button-primary').key}
        >
          {get('button-primary').props.content}
        </Button>
      )}

      {/* Secondary Button */}
      {renderIf('button-secondary') && (
        <Button
          size={get('button-secondary').props.size || 'lg'}
          variant={get('button-secondary').props.variant || 'secondary'}
          href={get('button-secondary').props.href}
          action={get('button-secondary').props.action}
          rightIcon={get('button-secondary').props.rightIcon}
          leftIcon={get('button-secondary').props.leftIcon}
          componentKey={get('button-secondary').key}
        >
          {get('button-secondary').props.content}
        </Button>
      )}

      {/* Ghost Button */}
      {renderIf('button-ghost') && (
        <Button
          size={get('button-ghost').props.size || 'lg'}
          variant={get('button-ghost').props.variant || 'ghost'}
          href={get('button-ghost').props.href}
          action={get('button-ghost').props.action}
          rightIcon={get('button-ghost').props.rightIcon}
          leftIcon={get('button-ghost').props.leftIcon}
          componentKey={get('button-ghost').key}
        >
          {get('button-ghost').props.content}
        </Button>
      )}

    </HStack>
  );
};

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
