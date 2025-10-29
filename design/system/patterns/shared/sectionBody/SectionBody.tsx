// ===============================================
// LOCATION: design/system/components/patterns/content-blocks/SectionBody/SectionBody.tsx
// SectionBody - Simplified, cleaner, with TextLink support
// ===============================================

import React, { ReactNode } from 'react';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography, TypographyVariant, TypographyColor, TypographyWeight, TypographyAlign } from '../../../components/Typography/Typography';
import { Tag, TagVariant, TagSize } from '../../../components/feedback/Tag/Tag';
import { TextLink, TextLinkProps } from '../../../components/actions/TextLink/TextLink';
import { Button, ButtonProps } from '../../../components/actions/Button/Button';
import { Input } from '../../../components/forms/Input/Input';
import { SegmentedControl } from '../../../components/actions/SegmentedControl/SegmentedControl';
import { cn } from '../../../lib/utils';
import './SectionBody.css';

// ===== TYPE DEFINITIONS =====

export type SectionBodyActionType = 
  | 'none'
  | 'button' 
  | 'button-group' 
  | 'input-button'
  | 'segmented-control'
  | 'text-link';

export interface SectionBodyTagConfig {
  text: string;
  variant?: TagVariant;
  size?: TagSize;
  icon?: ReactNode;
  href?: string; // Optional link inside tag
}

export interface SectionBodyTextLinkConfig extends Omit<TextLinkProps, 'children'> {
  text: string;
}

export interface SectionBodyButtonConfig extends Omit<ButtonProps, 'children'> {
  text: string;
  onClick?: () => void;
}

export interface SectionBodyInputButtonConfig {
  inputPlaceholder?: string;
  buttonText: string;
  onSubmit?: (value: string) => void;
}

export interface SectionBodySegmentedConfig {
  options: Array<{ label: string; value: string }>;
  value: string; // Required for SegmentedControl
  onChange: (value: string) => void; // Required for SegmentedControl
}

export interface SectionBodyProps {
  // ===== MAIN CONTENT (REQUIRED) =====
  /** Heading text - REQUIRED, cannot be hidden */
  heading: ReactNode;
  /** Body text - can be hidden */
  body?: ReactNode;
  
  // ===== OPTIONAL ELEMENTS =====
  /** Tag/Label component above heading (can contain link) */
  tag?: SectionBodyTagConfig | false;
  /** Text link instead of tag (mutually exclusive) */
  textLink?: SectionBodyTextLinkConfig | false;
  
  // ===== HEADING STYLING =====
  headingVariant?: TypographyVariant;
  headingColor?: TypographyColor;
  headingWeight?: TypographyWeight;
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  
  // ===== BODY TEXT STYLING =====
  bodyVariant?: TypographyVariant;
  bodyColor?: TypographyColor;
  bodyWeight?: TypographyWeight;
  bodyAs?: 'p' | 'div' | 'span';
  
  // ===== ACTION COMPONENTS =====
  actionType?: SectionBodyActionType;
  button?: SectionBodyButtonConfig;
  buttonGroup?: SectionBodyButtonConfig[];
  inputButton?: SectionBodyInputButtonConfig;
  segmentedControl?: SectionBodySegmentedConfig;
  actionTextLink?: SectionBodyTextLinkConfig; // For action area text links
  
  // ===== LAYOUT & SPACING =====
  textAlign?: TypographyAlign;
  tagSpacing?: 'xs' | 'sm' | 'md' | 'lg';
  headingBodySpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  bodyActionSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  maxWidth?: string | number;
  buttonGroupSpacing?: 'xs' | 'sm' | 'md' | 'lg';
  
  // ===== VISIBILITY CONTROLS =====
  hideBody?: boolean;
  hideTag?: boolean;
  hideTextLink?: boolean;
  hideActions?: boolean;
  
  // ===== STYLE & CLASSES =====
  className?: string;
  style?: React.CSSProperties;
}

// ===== SPACING HELPER =====
const getSpacingValue = (size: string): string => {
  const spacingMap: Record<string, string> = {
    'xs': '0.5rem',
    'sm': '1rem',
    'md': '1.5rem',
    'lg': '2rem',
    'xl': '3rem',
    '2xl': '4rem',
  };
  return spacingMap[size] || spacingMap.md;
};

// ===== MAIN SECTION BODY COMPONENT =====

export const SectionBody: React.FC<SectionBodyProps> = ({
  // Content
  heading,
  body,
  tag,
  textLink,
  
  // Heading styling
  headingVariant = 'display-md',
  headingColor = 'heading',
  headingWeight = 'bold',
  headingAs = 'h2',
  
  // Body styling
  bodyVariant = 'body-lg',
  bodyColor = 'body',
  bodyWeight = 'regular',
  bodyAs = 'p',
  
  // Actions
  actionType = 'none',
  button,
  buttonGroup,
  inputButton,
  segmentedControl,
  actionTextLink,
  
  // Layout
  textAlign = 'center',
  tagSpacing = 'sm',
  headingBodySpacing = 'md',
  bodyActionSpacing = 'lg',
  maxWidth = '650px',
  buttonGroupSpacing = 'md',
  
  // Visibility
  hideBody = false,
  hideTag = false,
  hideTextLink = false,
  hideActions = false,
  
  // Style
  className,
  style,
}) => {
  const hasTag = !hideTag && tag;
  const hasTextLink = !hideTextLink && textLink;
  const hasBody = !hideBody && body;
  const hasActions = !hideActions && actionType !== 'none';

  return (
    <Box
      className={cn('section-body', `section-body--align-${textAlign}`, className)}
      style={{
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        margin: '0 auto',
        ...style,
      }}
    >
      <VStack spacing="md" align={textAlign === 'center' ? 'center' : 'start'}>
        
        {/* Tag or TextLink (mutually exclusive) */}
        {hasTag && tag && (
          <Box className="section-body__tag" style={{ marginBottom: getSpacingValue(tagSpacing) }}>
            {tag.href ? (
              <TextLink href={tag.href} variant="accent" size="sm">
                <Tag
                  variant={tag.variant || 'accent'}
                  size={tag.size || 'medium'}
                  icon={tag.icon}
                >
                  {tag.text}
                </Tag>
              </TextLink>
            ) : (
              <Tag
                variant={tag.variant || 'accent'}
                size={tag.size || 'medium'}
                icon={tag.icon}
              >
                {tag.text}
              </Tag>
            )}
          </Box>
        )}

        {hasTextLink && textLink && !hasTag && (
          <Box className="section-body__text-link" style={{ marginBottom: getSpacingValue(tagSpacing) }}>
            <TextLink
              variant={textLink.variant || 'accent'}
              size={textLink.size || 'md'}
              weight={textLink.weight || 'semibold'}
              href={textLink.href}
              {...textLink}
            >
              {textLink.text}
            </TextLink>
          </Box>
        )}

        {/* Heading */}
        <Typography
          as={headingAs}
          variant={headingVariant}
          color={headingColor}
          weight={headingWeight}
          align={textAlign}
          className="section-body__heading"
        >
          {heading}
        </Typography>

        {/* Body Text */}
        {hasBody && (
          <Box style={{ marginTop: getSpacingValue(headingBodySpacing) }}>
            <Typography
              as={bodyAs}
              variant={bodyVariant}
              color={bodyColor}
              weight={bodyWeight}
              align={textAlign}
              className="section-body__body"
            >
              {body}
            </Typography>
          </Box>
        )}

        {/* Actions */}
        {hasActions && (
          <Box 
            style={{ marginTop: getSpacingValue(bodyActionSpacing) }}
            className="section-body__actions"
          >
            {/* Single Button */}
            {actionType === 'button' && button && (
              <Button
                variant={button.variant || 'primary'}
                size={button.size || 'lg'}
                onClick={button.onClick}
                {...button}
              >
                {button.text}
              </Button>
            )}

            {/* Button Group */}
            {actionType === 'button-group' && buttonGroup && buttonGroup.length > 0 && (
              <HStack 
                spacing={buttonGroupSpacing} 
                justify="center"
                className="section-body__button-group"
              >
                {buttonGroup.map((btn, index) => (
                  <Button
                    key={index}
                    variant={btn.variant || (index === 0 ? 'primary' : 'secondary')}
                    size={btn.size || 'lg'}
                    onClick={btn.onClick}
                    {...btn}
                  >
                    {btn.text}
                  </Button>
                ))}
              </HStack>
            )}

            {/* Input + Button */}
            {actionType === 'input-button' && inputButton && (
              <HStack spacing="sm" className="section-body__input-button">
                <Input
                  type="text"
                  placeholder={inputButton.inputPlaceholder || 'Enter your email...'}
                  className="section-body__input"
                />
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => inputButton.onSubmit?.('')}
                >
                  {inputButton.buttonText}
                </Button>
              </HStack>
            )}

            {/* Segmented Control */}
            {actionType === 'segmented-control' && 
             segmentedControl && 
             segmentedControl.options.length > 0 && 
             segmentedControl.value !== undefined && 
             segmentedControl.onChange !== undefined && (
              <SegmentedControl
                options={segmentedControl.options}
                value={segmentedControl.value}
                onChange={segmentedControl.onChange}
                size="md"
              />
            )}

            {/* Text Link (as action) */}
            {actionType === 'text-link' && actionTextLink && (
              <TextLink
                variant={actionTextLink.variant || 'accent'}
                size={actionTextLink.size || 'lg'}
                weight={actionTextLink.weight || 'semibold'}
                href={actionTextLink.href}
                {...actionTextLink}
              >
                {actionTextLink.text}
              </TextLink>
            )}
          </Box>
        )}
      </VStack>
    </Box>
  );
};

SectionBody.displayName = 'SectionBody';

export default SectionBody;