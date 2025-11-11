// ===============================================
// LOCATION: design/system/components/patterns/content-blocks/SectionBody/SectionBody.tsx
// SectionBody - NO CSS FILE NEEDED - Uses existing layout components
// ===============================================

import React, { ReactNode } from 'react';
import { VStack } from '../../../components/layout/vStack/VStack';
import { Box } from '../../../components/layout/box/Box';
import { Typography, TypographyAlign } from '../../../components/Typography/Typography';
import { Tag, TagVariant, TagSize } from '../../../components/feedback/Tag/Tag';
import { TextLinkProps } from '../../../components/actions/TextLink/TextLink';
import { Button, ButtonProps } from '../../../components/actions/Button/Button';

// ===== TYPE DEFINITIONS =====

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
  

  
  // ===== ACTION COMPONENTS =====
  button?: SectionBodyButtonConfig;
  
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
  components,
  
  // Content (Legacy)
  heading: legacyHeading,
  body: legacyBody,
  tag: legacyTag,
  
  // Actions

  button,
  
  // Layout
  textAlign = 'center',
  headingBodySpacing = 'md',
  maxWidth = '650px',
  
  // Style
  className,
  style,
}) => {
  // ===== EXTRACT DATA FROM JSON COMPONENTS OR USE LEGACY PROPS =====
  let heading: ReactNode;
  let body: ReactNode;
  let tag: SectionBodyTagConfig | false;
  let buttonText: string = '';

  if (components) {
    // Extract data from JSON structure
    const headingComponent = Object.values(components).find((c: any) => c.type === 'heading');
    const bodyComponent = Object.values(components).find((c: any) => c.type === 'body');
    const tagComponent = Object.values(components).find((c: any) => c.type === 'tag');
    const buttonComponent = Object.values(components).find((c: any) => c.type === 'button');

    // Map to component props
    heading = typeof headingComponent?.content === 'string' 
      ? headingComponent.content 
      : (headingComponent?.content?.content || '');
    body = typeof bodyComponent?.content === 'string' 
      ? bodyComponent.content 
      : (bodyComponent?.content?.content || '');
    tag = tagComponent?.content ? {
      text: typeof tagComponent.content === 'string' 
        ? tagComponent.content 
        : (tagComponent.content?.content || ''),
      size: 'medium'
    } : false;

    // Handle button text
    buttonText = typeof buttonComponent?.content === 'string' 
      ? buttonComponent.content 
      : (buttonComponent?.content?.content || '');
  } else {
    // Use legacy props
    heading = legacyHeading;
    body = legacyBody;
    tag = legacyTag || false;
    buttonText = button?.text || '';
  }

  // Map alignment for VStack
  const vStackAlign = textAlign === 'center' ? 'center' : textAlign === 'right' ? 'end' : 'start';
  

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
        
        {/* Tag */}
        <Box>
          <Tag
            size="medium"
            icon={null}
          >
            {tag && tag.text}
          </Tag>
        </Box>

        {/* Heading */}
        <Typography
          as="h2"
          variant="display-lg"
          color="heading"
          weight="bold"
          align={textAlign}
        >
          {heading}
        </Typography>

        {/* Body Text */}
        <Typography
          as="p"
          variant="body-lg"
          color="body"
          weight="regular"
          align={textAlign}
        >
          {body}
        </Typography>

        {/* Button */}
        <Button
          size="lg"
        >
          {buttonText}
        </Button>
      </VStack>
    </Box>
  );
};

SectionBody.displayName = 'SectionBody';

export default SectionBody;