// ===============================================
// LOCATION: design/system/components/patterns/content-blocks/SectionBody/SectionBody.tsx
// SectionBody - NO CSS FILE NEEDED - Uses existing layout components
// ===============================================
'use client';

import { useState } from 'react';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography } from '../../../components/Typography/Typography';
import { Tag } from '../../../components/feedback/Tag/Tag';
import { Button } from '../../../components/actions/Button/Button';
import { Input } from '../../../components/forms/Input/Input';
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

  // State for email input value
  const [emailValue, setEmailValue] = useState('');

  // Get spacing from props with fallback to 'md'
  const spacing = props?.spacing || 'md';

  // Get hero spacing configuration
  // Auto-detect hero sections by sectionKey prefix, or use manual isHero prop
  const isHero = sectionKey?.startsWith('hero_') || props?.isHero || false;
  const heroSpacingMobile = props?.heroSpacingMobile || 1.5;
  const heroSpacingDesktop = props?.heroSpacingDesktop || 1;

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
        {renderIf('tag') && get('tag').props.content && (
          <Box>
            <Tag
              size="medium"
              variant='accent'
              icon={null}
              componentKey={get('tag').key}
            >
              {get('tag').props.content}
            </Tag>
          </Box>
        )}

        {/* Heading - render if content OR animation exists (countUp generates content) */}
        {renderIf('typography-heading') && (get('typography-heading').props.content || get('typography-heading').props.animation) && (
          <Typography
            as={isHero ? "h1" : "h2"}
            variant="display-lg"
            color="heading"
            align="center"
            animation={get('typography-heading').props.animation}
            componentKey={get('typography-heading').key}
          >
            {get('typography-heading').props.content}
          </Typography>
        )}

        {/* Body Text - only render if exists */}
        {renderIf('typography-body') && get('typography-body').props.content && (
          <Typography
            as="p"
            variant="body-lg"
            color="body"
            weight="regular"
            align="center"
            animation={get('typography-body').props.animation}
            componentKey={get('typography-body').key}
          >
            {get('typography-body').props.content}
          </Typography>
        )}

        {/* Input + Button Group - render if input exists */}
        {renderIf('input-email') && (
          <Box style={{ width: '100%', maxWidth: '500px' }}>
            <HStack spacing="sm" align="stretch">
              <Input
                type={get('input-email').props.type || 'email'}
                placeholder={get('input-email').props.placeholder || 'Enter your email'}
                size={get('input-email').props.size || 'lg'}
                fullWidth
                componentKey={get('input-email').key}
                value={emailValue}
                onValueChange={setEmailValue}
              />
              {renderIf('button-submit') && get('button-submit').props.content && (
                <Button
                  size={get('button-submit').props.size || 'lg'}
                  variant={get('button-submit').props.variant || 'accent'}
                  componentKey={get('button-submit').key}
                  action={get('button-submit').props.action}
                  formData={{ email: emailValue }}
                  style={{ flexShrink: 0 }}
                >
                  {get('button-submit').props.content}
                </Button>
              )}
            </HStack>
          </Box>
        )}

        {/* Button - only render if exists AND no input */}
        {!renderIf('input-email') && renderIf('button-primary') && get('button-primary').props.content && (
          <Button
            size="lg"
            variant='accent'
            href={get('button-primary').props.href}
            action={get('button-primary').props.action}
            componentKey={get('button-primary').key}
          >
            {get('button-primary').props.content}
          </Button>
        )}
      </VStack>
    </Box>
    </>
  );
};

SectionBody.displayName = 'SectionBody';

export default SectionBody;