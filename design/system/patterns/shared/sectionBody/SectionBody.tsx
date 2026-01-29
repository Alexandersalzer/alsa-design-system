// ===============================================
// LOCATION: design/system/components/patterns/content-blocks/SectionBody/SectionBody.tsx
// SectionBody - NO CSS FILE NEEDED - Uses existing layout components
// ===============================================
'use client';

import { useState, useEffect } from 'react';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../components/Typography/Typography';
import { Tag } from '../../../components/feedback/Tag/Tag';
import { Button } from '../../../components/actions/Button/Button';
import { Input } from '../../../components/forms/Input/Input';
import { FadeIn } from '../../../components/animations/FadeIn/FadeIn';
import { Icon } from '../../../components/media/Icon/Icon';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { ComponentNode } from '../../../core/types/nodes';
import { useAction } from '../../../core/actions/useAction';

// ===== MAIN SECTION BODY COMPONENT =====

interface SectionBodyProps {
  components?: Record<string, ComponentNode>;
  sectionKey?: string;
  patternKey?: string;
  type?: string;
  props?: Record<string, any>;
}

const SectionBody = ({ components = {}, sectionKey, patternKey, props }: SectionBodyProps) => {
  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // State for email input value
  const [emailValue, setEmailValue] = useState('');

  // Action handling for newsletter submission
  const buttonAction = renderIf('button-submit') ? get('button-submit').props.action : null;
  const { execute, loading, success, error, message, reset } = useAction(buttonAction);

  // Handle form submission
  const handleSubmit = async () => {
    if (!emailValue.trim()) return;

    const result = await execute({ email: emailValue });
    if (result.success) {
      setEmailValue(''); // Clear input on success
    }
  };

  // Get spacing from props with fallback to 'md'
  const spacing = props?.spacing || 'md';

  // Alignment props - controls how content is positioned within the section
  // 'center' (default) - centered content as before
  // 'start' - left-aligned content for split layouts with media on the side
  // 'end' - right-aligned content
  const align = props?.align || 'center';
  const textAlign = props?.textAlign || (align === 'center' ? 'center' : 'left');

  // Max width control - smaller width when in split layout
  const maxWidth = props?.maxWidth || '650px';

  // Get hero spacing configuration
  // Auto-detect hero sections by sectionKey prefix, or use manual isHero prop
  const isHero = sectionKey?.startsWith('hero_') || props?.isHero || false;
  const heroSpacingMobile = props?.heroSpacingMobile || 1.5;
  const heroSpacingDesktop = props?.heroSpacingDesktop || 1;

  // Animation configuration
  const animationDirection = props?.animationDirection || 'up';
  const animationDuration = props?.animationDuration || 600;
  const animationDelay = props?.animationDelay || 0;
  const animationStagger = props?.animationStagger || 100; // Delay between elements

  // Read animation mode from CSS variable (set in design.json)
  // 'all' = animate all sections, 'hero' = only hero sections, 'none' = no animations
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
  const shouldAnimate = animationMode === 'all' || (animationMode === 'hero' && isHero);

  // Helper to wrap content with animation
  // Checks if component has its own animation prop - if so, skip FadeIn wrapper
  const withAnimation = (content: React.ReactNode, index: number = 0, componentKey?: string) => {
    if (!shouldAnimate) return content;
    
    // If componentKey provided, check if component has its own animation
    if (componentKey && get(componentKey).props?.animation) {
      return content; // Skip FadeIn wrapper - component handles animation itself
    }

    return (
      <FadeIn
        direction={animationDirection}
        duration={animationDuration}
        delay={animationDelay + (index * animationStagger)}
        enableScrollTrigger={true}
        triggerOffset={100}
      >
        {content}
      </FadeIn>
    );
  };

  return (
    <>
      {isHero && (
        <style>{`
          @media (max-width: 767px) {
            .section-body--hero-${patternKey} {
              padding-top: calc(var(--space-section) * ${heroSpacingMobile});
            }
          }
          @media (min-width: 768px) {
            .section-body--hero-${patternKey} {
              padding-top: calc(var(--space-section) * ${heroSpacingDesktop});
            }
          }
        `}</style>
      )}
      <Box
        style={{
          maxWidth: maxWidth,
          margin: align === 'center' ? '0 auto' : align === 'end' ? '0 0 0 auto' : '0 auto 0 0',
          width: '100%',
        }}
        className={isHero ? `section-body--hero-${patternKey}` : ''}
      >
      <VStack spacing={spacing} align={align === 'center' ? 'center' : 'start'}>

        {/* Tag - only render if exists */}
        {renderIf('tag') && get('tag').props.content && withAnimation(
          <Box>
            <Tag
              size="medium"
              variant='accent'
              icon={null}
              componentKey={get('tag').key}
            >
              {get('tag').props.content}
            </Tag>
          </Box>,
          0,
          'tag'
        )}

        {/* Heading - render if content OR animation exists (countUp generates content) */}
        {renderIf('typography-heading') && (get('typography-heading').props.content || get('typography-heading').props.animation) && withAnimation(
          <Typography
            as={isHero ? "h1" : "h2"}
            variant="display-lg"
            color="heading"
            align={textAlign}
            animation={get('typography-heading').props.animation}
            componentKey={get('typography-heading').key}
          >
            {get('typography-heading').props.content}
          </Typography>,
          1,
          'typography-heading'
        )}

        {/* Body Text - only render if exists */}
        {renderIf('typography-body') && get('typography-body').props.content && withAnimation(
          <Typography
            as="p"
            variant="body-lg"
            color="body"
            weight="regular"
            align={textAlign}
            animation={get('typography-body').props.animation}
            componentKey={get('typography-body').key}
          >
            {get('typography-body').props.content}
          </Typography>,
          2,
          'typography-body'
        )}

        {/* Input + Button Group - render if input exists */}
        {renderIf('input-email') && withAnimation(
          <Box style={{ width: '100%', maxWidth: '500px' }}>
            <VStack spacing="sm">
              <HStack spacing="sm" align="stretch">
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
          </Box>,
          3,
          'input-email'
        )}

        {/* Button - only render if exists AND no input */}
        {!renderIf('input-email') && renderIf('button-primary') && get('button-primary').props.content && withAnimation(
          <Button
            size="lg"
            variant='accent'
            href={get('button-primary').props.href}
            action={get('button-primary').props.action}
            componentKey={get('button-primary').key}
          >
            {get('button-primary').props.content}
          </Button>,
          3,
          'button-primary'
        )}
      </VStack>
    </Box>
    </>
  );
};

SectionBody.displayName = 'SectionBody';

export default SectionBody;