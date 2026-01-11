// ===============================================
// LOCATION: design/system/components/patterns/content-blocks/SectionBody/SectionBody.tsx
// SectionBody - NO CSS FILE NEEDED - Uses existing layout components
// ===============================================
'use client';

import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../components/Typography/Typography';
import { Tag } from '../../../components/feedback/Tag/Tag';
import { Button } from '../../../components/actions/Button/Button';
import { Input } from '../../../components/forms/Input/Input';
import { CountUp } from '../../../components/animations/CountUp/CountUp';
import { FadeIn } from '../../../components/animations/FadeIn/FadeIn';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { ComponentNode } from '../../../core/types/nodes';

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

  // Get spacing from props with fallback to 'md'
  const spacing = props?.spacing || 'md';

  // Get hero spacing configuration
  // Auto-detect hero sections by sectionKey prefix, or use manual isHero prop
  const isHero = sectionKey?.startsWith('hero_') || props?.isHero || false;
  const heroSpacingMobile = props?.heroSpacingMobile || 1.5;
  const heroSpacingDesktop = props?.heroSpacingDesktop || 1;

  // Animation configuration
  const enableAnimation = props?.enableAnimation !== false; // Default true
  const animationType = props?.animationType || 'fadeIn'; // 'fadeIn' or 'none'
  const animationDirection = props?.animationDirection || 'up';
  const animationDuration = props?.animationDuration || 600;
  const animationDelay = props?.animationDelay || 0;
  const animationStagger = props?.animationStagger || 100; // Delay between elements

  // CountUp configuration for heading
  const enableCountUp = props?.enableCountUp || false;
  const countUpEnd = props?.countUpEnd || 100;
  const countUpDuration = props?.countUpDuration || 2000;
  const countUpSuffix = props?.countUpSuffix || '';
  const countUpPrefix = props?.countUpPrefix || '';

  // Helper to wrap content with animation
  const withAnimation = (content: React.ReactNode, index: number = 0) => {
    if (!enableAnimation || animationType === 'none') return content;

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
          maxWidth: '650px',
          margin: '0 auto',
          width: '100%',
        }}
        className={isHero ? `section-body--hero-${patternKey}` : ''}
      >
      <VStack spacing={spacing} align="center">

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
          0
        )}

        {/* Heading - only render if exists */}
        {renderIf('typography-heading') && get('typography-heading').props.content && withAnimation(
          enableCountUp ? (
            <CountUp
              end={countUpEnd}
              duration={countUpDuration}
              suffix={countUpSuffix}
              prefix={countUpPrefix}
              variant="display-lg"
              color="heading"
              align="center"
              enableScrollTrigger={true}
              componentKey={get('typography-heading').key}
            />
          ) : (
            <Typography
              as="h2"
              variant="display-lg"
              color="heading"
              align="center"
              componentKey={get('typography-heading').key}
            >
              {get('typography-heading').props.content}
            </Typography>
          ),
          1
        )}

        {/* Body Text - only render if exists */}
        {renderIf('typography-body') && get('typography-body').props.content && withAnimation(
          <Typography
            as="p"
            variant="body-lg"
            color="body"
            weight="regular"
            align="center"
            componentKey={get('typography-body').key}
          >
            {get('typography-body').props.content}
          </Typography>,
          2
        )}

        {/* Input + Button Group - render if input exists */}
        {renderIf('input-email') && withAnimation(
          <Box style={{ width: '100%', maxWidth: '500px' }}>
            <HStack spacing="sm" align="stretch">
              <Input
                type={get('input-email').props.type || 'email'}
                placeholder={get('input-email').props.placeholder || 'Enter your email'}
                size={get('input-email').props.size || 'lg'}
                fullWidth
                componentKey={get('input-email').key}
              />
              {renderIf('button-submit') && get('button-submit').props.content && (
                <Button
                  size={get('button-submit').props.size || 'lg'}
                  variant={get('button-submit').props.variant || 'accent'}
                  componentKey={get('button-submit').key}
                  style={{ flexShrink: 0 }}
                >
                  {get('button-submit').props.content}
                </Button>
              )}
            </HStack>
          </Box>,
          3
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
          3
        )}
      </VStack>
    </Box>
    </>
  );
};

SectionBody.displayName = 'SectionBody';

export default SectionBody;