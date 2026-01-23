// ===============================================
// InputGroup Pattern Component
// Email input + Submit button (for newsletter, waitlist, etc.)
// ===============================================

'use client';

import React, { useState } from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { HStack } from '../../../components/layout/hStack/HStack';
import { VStack } from '../../../components/layout/vStack/VStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../components/Typography/Typography';
import { Input } from '../../../components/forms/Input/Input';
import { Button } from '../../../components/actions/Button/Button';
import { useAction } from '../../../core/actions/useAction';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export interface InputGroupProps extends PatternNode {
  type: 'InputGroup';
  layoutContext?: {
    alignSectionHeader?: 'left' | 'center' | 'right';
    isInSecondColumn?: boolean;
    verticalAlign?: 'start' | 'center' | 'end';
  };
}

export const InputGroup: React.FC<InputGroupProps> = (patternNode) => {
  const { components = {}, props, layoutContext } = patternNode;
  const get = componentProps(components);
  const renderIf = componentPresent(components);
  
  // Get alignment from props or inherit from layout context
  const align = props?.align || layoutContext?.alignSectionHeader || 'center';
  const gap = props?.gap || 'sm';
  const verticalAlign = props?.verticalAlign || 'stretch';

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

  return (
    <Box style={{ width: '100%' }}>
      <VStack spacing="sm">
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
};

InputGroup.displayName = 'InputGroup';

export default InputGroup;
