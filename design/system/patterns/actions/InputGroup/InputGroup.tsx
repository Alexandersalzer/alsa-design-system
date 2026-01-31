// ===============================================
// InputGroup Pattern Component
// Email input + Submit button (for newsletter, waitlist, etc.)
// ===============================================

'use client';

import React, { useState, useEffect } from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { HStack } from '../../../components/layout/hStack/HStack';
import { VStack } from '../../../components/layout/vStack/VStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../components/Typography/Typography';
import { Input } from '../../../components/forms/Input/Input';
import { Button } from '../../../components/actions/Button/Button';
import { useAction } from '../../../core/actions/useAction';
import { FadeIn } from '../../../components/animations/FadeIn/FadeIn';
import { Opacity } from '../../../components/animations/Opacity/Opacity';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { AnimationConfig } from '../../../components/animations/types';

export interface InputGroupProps extends PatternNode {
  type: 'InputGroup';
  sectionKey?: string;
  patternKey?: string;
  layoutContext?: {
    alignSectionHeader?: 'left' | 'center' | 'right';
    isInSecondColumn?: boolean;
    verticalAlign?: 'start' | 'center' | 'end';
    sectionAnimation?: AnimationConfig;
  };
}

export const InputGroup: React.FC<InputGroupProps> = (patternNode) => {
  const { components = {}, props, layoutContext, sectionKey } = patternNode;
  const get = componentProps(components);
  const renderIf = componentPresent(components);
  
  // Get alignment from props or inherit from layout context
  const align = props?.align || layoutContext?.alignSectionHeader || 'center';
  const gap = props?.gap || 'sm';
  const verticalAlign = props?.verticalAlign || 'stretch';
  
  // Map alignment to justify for HStack
  const getJustify = () => {
    if (align === 'left') return 'start';
    if (align === 'right') return 'end';
    return 'center';
  };
  const justify = getJustify();

  // Animation configuration
  const isHero = sectionKey?.startsWith('hero_') || props?.isHero || false;
  
  // Check if section has specific animation config
  const sectionAnimationConfig = layoutContext?.sectionAnimation;
  
  // Use section animation settings if available, otherwise use props or defaults
  // Type guard: only fadeIn has direction setting
  const animationDirection = (sectionAnimationConfig?.type === 'fadeIn' && sectionAnimationConfig.settings?.direction) 
    || props?.animationDirection 
    || 'up';
  const animationDuration = sectionAnimationConfig?.settings?.duration || props?.animationDuration || 600;
  const animationDelay = sectionAnimationConfig?.settings?.delay || props?.animationDelay || 0;

  // Read animation mode from CSS variable (set in design.json)
  const [animationMode, setAnimationMode] = useState<'all' | 'hero' | 'none'>('all');

  useEffect(() => {
    // Read CSS variable on client-side after mount to avoid hydration mismatch
    const cssValue = getComputedStyle(document.documentElement)
      .getPropertyValue('--section-body-animation')
      .replace(/['"`]/g, '')
      .trim() as 'all' | 'hero' | 'none';
    
    if (cssValue && (cssValue === 'all' || cssValue === 'hero' || cssValue === 'none')) {
      setAnimationMode(cssValue);
    }
  }, []);

  // Determine if animation should be enabled for this section
  // Priority: section animation > global animation mode
  const shouldAnimate = sectionAnimationConfig 
    ? sectionAnimationConfig.type !== 'none' 
    : (animationMode === 'all' || (animationMode === 'hero' && isHero));

  // State for email input value
  const [emailValue, setEmailValue] = useState('');

  // Action handling for newsletter submission
  const buttonAction = renderIf('button-submit') ? get('button-submit').props.action : null;
  const { execute, loading, success, error, message } = useAction(buttonAction);

  // Handle form submission
  const handleSubmit = async () => {
    if (!emailValue.trim()) return;
    
    const result = await execute({ email: emailValue });
    if (result.success) {
      setEmailValue(''); // Clear input on success
    }
  };

  const inputGroupContent = (
    <Box style={{ width: '100%' }}>
      <VStack spacing="sm" align={justify}>
        <HStack spacing={gap} align={verticalAlign}>
          {/* Email Input */}
          {renderIf('input-email') && (
            <Input
              type={get('input-email').props.type || 'email'}
              placeholder={get('input-email').props.placeholder || 'Enter your email'}
              size={get('input-email').props.size || 'lg'}
              fullWidth
              componentKey={get('input-email').key}
              value={emailValue}
              onValueChange={setEmailValue}
              disabled={loading}
            />
          )}

          {/* Submit Button */}
          {renderIf('button-submit') && get('button-submit').props.content && (
            <Button
              size={get('button-submit').props.size || 'lg'}
              variant={get('button-submit').props.variant || 'accent'}
              componentKey={get('button-submit').key}
              onClick={handleSubmit}
              disabled={loading || !emailValue.trim()}
              style={{ flexShrink: 0 }}
            >
              {loading ? 'Sending...' : get('button-submit').props.content}
            </Button>
          )}
        </HStack>
        
        {/* Success Message */}
        {success && (
          <HStack spacing="xs" align="center" style={{ color: 'var(--color-success)' }}>
            <CheckCircleIcon style={{ width: '20px', height: '20px' }} />
            <Typography variant="body-sm" color="success">
              {message || 'Successfully submitted!'}
            </Typography>
          </HStack>
        )}

        {/* Error Message */}
        {error && (
          <HStack spacing="xs" align="center" style={{ color: 'var(--color-error)' }}>
            <XCircleIcon style={{ width: '20px', height: '20px' }} />
            <Typography variant="body-sm" color="error">
              {message || 'Something went wrong. Please try again.'}
            </Typography>
          </HStack>
        )}
      </VStack>
    </Box>
  );

  // If animation is disabled, return content directly
  if (!shouldAnimate) {
    return inputGroupContent;
  }

  // Determine animation component based on type
  const animationType = sectionAnimationConfig?.type || 'fadeIn';

  // If opacity animation, use Opacity component
  if (animationType === 'opacity') {
    return (
      <Opacity
        duration={animationDuration}
        delay={animationDelay}
        enableScrollTrigger={true}
        triggerOffset={100}
      >
        {inputGroupContent}
      </Opacity>
    );
  }

  // Default: use FadeIn component
  return (
    <FadeIn
      direction={animationDirection}
      duration={animationDuration}
      delay={animationDelay}
      enableScrollTrigger={true}
      triggerOffset={100}
    >
      {inputGroupContent}
    </FadeIn>
  );
};

InputGroup.displayName = 'InputGroup';

export default InputGroup;
