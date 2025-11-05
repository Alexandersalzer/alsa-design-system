// ===============================================
// LOCATION: design/system/components/patterns/content-blocks/SectionBody/SectionBody.tsx
// SectionBody - NO CSS FILE NEEDED - Uses existing layout components
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
  href?: string;
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
  value: string;
  onChange: (value: string) => void;
}

// ===== JSON COMPONENT STRUCTURE =====
export interface JsonComponent {
  type: string;
  content: any;
}

export interface SectionBodyProps {
  // ===== NEW: JSON STRUCTURE SUPPORT =====
  type?: string;
  components?: Record<string, JsonComponent>;
  
  // ===== MAIN CONTENT (Legacy support) =====
  heading?: ReactNode;
  body?: ReactNode;
  
  // ===== OPTIONAL ELEMENTS =====
  tag?: SectionBodyTagConfig | false;
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
  actionTextLink?: SectionBodyTextLinkConfig;
  
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

// ===== MAIN SECTION BODY COMPONENT =====

export const SectionBody: React.FC<SectionBodyProps> = ({
  // NEW: JSON Structure
  type,
  components,
  
  // Content (Legacy)
  heading: legacyHeading,
  body: legacyBody,
  tag: legacyTag,
  textLink,
  
  // Heading styling
  headingVariant = 'display-xl',
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
  // ===== EXTRACT DATA FROM JSON COMPONENTS OR USE LEGACY PROPS =====
  let heading: ReactNode;
  let body: ReactNode;
  let tag: SectionBodyTagConfig | false;
  let actionType_final: SectionBodyActionType = actionType;
  let button_final: SectionBodyButtonConfig | undefined;

  if (components) {
    // Extract data from JSON structure
    const headingComponent = Object.values(components).find((c: any) => c.type === 'heading');
    const bodyComponent = Object.values(components).find((c: any) => c.type === 'body');
    const tagComponent = Object.values(components).find((c: any) => c.type === 'tag');
    const buttonComponent = Object.values(components).find((c: any) => c.type === 'button');

    // Map to component props
    heading = headingComponent?.content || '';
    body = bodyComponent?.content || undefined;
    tag = tagComponent?.content ? {
      text: tagComponent.content,
      variant: 'accent',
      size: 'medium'
    } : false;

    // Handle button action
    if (buttonComponent?.content) {
      actionType_final = 'button';
      button_final = {
        text: typeof buttonComponent.content === 'object' ? buttonComponent.content.content : buttonComponent.content,
        variant: 'accent',
        size: 'xl'
      };
    }
  } else {
    // Use legacy props
    heading = legacyHeading;
    body = legacyBody;
    tag = legacyTag || false;
    button_final = button;
  }

  const hasTag = !hideTag && tag;
  const hasTextLink = !hideTextLink && textLink;
  const hasBody = !hideBody && body;
  const hasActions = !hideActions && actionType_final !== 'none';

  // Map alignment for VStack
  const vStackAlign = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'end' : 'start';
  
  // Map alignment for HStack (button groups)
  const hStackJustify = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'end' : 'start';

  return (
    <Box
      className={className}
      style={{
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        margin: '0 auto',
        width: '100%',
        ...style,
      }}
    >
      <VStack spacing={headingBodySpacing} align={vStackAlign}>
        
        {/* Tag or TextLink */}
        {hasTag && tag && (
          <Box>
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
          <Box>
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
        >
          {heading}
        </Typography>

        {/* Body Text */}
        {hasBody && (
          <Typography
            as={bodyAs}
            variant={bodyVariant}
            color={bodyColor}
            weight={bodyWeight}
            align={textAlign}
          >
            {body}
          </Typography>
        )}

        {/* Actions */}
        {hasActions && (
          <VStack spacing={bodyActionSpacing} align={vStackAlign}>
            
            {/* Single Button */}
            {actionType_final === 'button' && button_final && (
              <Button
                variant={button_final.variant || 'accent'}
                size={button_final.size || 'lg'}
                onClick={button_final.onClick}
                {...button_final}
              >
                {button_final.text}
              </Button>
            )}

            {/* Button Group */}
            {actionType_final === 'button-group' && buttonGroup && buttonGroup.length > 0 && (
              <HStack 
                spacing={buttonGroupSpacing} 
                justify={hStackJustify}
                wrap={true}
              >
                {buttonGroup.map((btn, index) => (
                  <Button
                    key={index}
                    variant={btn.variant || (index === 0 ? 'accent' : 'accent')}
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
            {actionType_final === 'input-button' && inputButton && (
              <HStack spacing="sm" wrap={false}>
                <Input
                  type="text"
                  placeholder={inputButton.inputPlaceholder || 'Enter your email...'}
                  style={{ flex: 1, minWidth: '200px' }}
                />
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => inputButton.onSubmit?.('')}
                >
                  {inputButton.buttonText}
                </Button>
              </HStack>
            )}

            {/* Segmented Control */}
            {actionType_final === 'segmented-control' && 
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
            {actionType_final === 'text-link' && actionTextLink && (
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
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

SectionBody.displayName = 'SectionBody';

export default SectionBody;