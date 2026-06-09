// ===============================================
// src/components/layouts/MainContent/MainContent.tsx
// REFACTORED - Full-width by default, matches header padding
// ===============================================

import React, { ReactNode } from 'react';
import { VStack, HStack, Box, Opacity, H1, H2, Body, Button, Icon } from '../design/index';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import './MainContent.css';

// ===============================================
// TYPES
// ===============================================

export type MainContentWidth = 'narrow' | 'default' | 'wide' | 'full';
export type MainContentPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface MainContentProps {
  /** Content to render */
  children: ReactNode;

  /** Maximum width variant */
  maxWidth?: MainContentWidth;

  /** Padding size */
  padding?: MainContentPadding;

  /** Whether to center the constraint horizontally in its parent (default: false).
   *  This only centers the constrained box itself — it does NOT collapse children
   *  to their natural width. Children always stretch to fill the constraint by
   *  default; override with `alignChildren` if you need otherwise. */
  centered?: boolean;

  /** Alignment of children inside the constraint (default: 'stretch').
   *  Use 'center' for marketing-style pages where you want children sized to
   *  their content (e.g. a centered hero). */
  alignChildren?: 'stretch' | 'center';

  /** Vertical alignment of content (default: start) */
  verticalAlign?: 'start' | 'center' | 'end';

  /** Spacing between direct children (default: lg) */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

  /** Whether to animate content with fade-in (default: true) */
  animate?: boolean;

  /** Animation duration in ms (default: 300) */
  animationDuration?: number;

  /** Additional CSS class */
  className?: string;

  /** Custom inline styles */
  style?: React.CSSProperties;
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export const MainContent: React.FC<MainContentProps> = ({
  children,
  maxWidth = 'full',
  padding = 'md',
  centered = false,
  alignChildren = 'stretch',
  verticalAlign = 'start',
  spacing = 'lg',
  animate = true,
  animationDuration = 300,
  className = '',
  style,
}) => {
  const paddingMap = {
    none: 'none',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    '2xl': '2xl',
  } as const;

  // Map vertical align to justify-content values
  const verticalAlignMap = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  } as const;

  const content = (
    <VStack spacing={spacing} align={alignChildren}>
      {children}
    </VStack>
  );

  return (
    <Box
      className={`main-content main-content--width-${maxWidth} ${centered ? 'main-content--centered' : ''} ${className}`}
      width="full"
      height="full"
      padding={paddingMap[padding]}
      style={{
        ...style,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: verticalAlignMap[verticalAlign],
      }}
    >
      <Box
        className={`main-content__constraint main-content__constraint--${maxWidth}`}
        width="full"
        style={{
          ...(centered ? { marginLeft: 'auto', marginRight: 'auto' } : undefined),
          ...(verticalAlign !== 'start' ? { width: '100%' } : undefined), // Ensure constraint respects alignment
        }}
      >
        {animate ? (
          <Opacity duration={animationDuration} enableScrollTrigger={false}>
            {content}
          </Opacity>
        ) : (
          content
        )}
      </Box>
    </Box>
  );
};


// ===============================================
// HEADER SUB-COMPONENT
// ===============================================

export interface MainContentHeaderProps {
  /** Page title (string or ReactNode for line breaks e.g. <>Rad 1<br />Rad 2</>) */
  title: React.ReactNode;
  
  /** Optional subtitle/description (string or ReactNode for line breaks) */
  subtitle?: React.ReactNode;
  
  /** Optional actions (buttons, etc.) */
  actions?: ReactNode;
  
  /** Optional back button handler */
  onBack?: () => void;
  
  /** Back button label */
  backLabel?: string;
  
  /** Additional content below title */
  children?: ReactNode;
  
  /** Additional CSS class */
  className?: string;
}

export const MainContentHeader: React.FC<MainContentHeaderProps> = ({
  title,
  subtitle,
  actions,
  onBack,
  backLabel = 'Tillbaka',
  children,
  className = '',
}) => {
  return (
    <VStack spacing="md" align="stretch" className={className}>
      {/* Back Button */}
      {onBack && (
        <Box>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Icon size="sm"><ArrowLeftIcon /></Icon>}
            onClick={onBack}
          >
            {backLabel}
          </Button>
        </Box>
      )}
      
      {/* Title Row with Actions */}
      <HStack 
        justify="between" 
        align="center"
        spacing="lg"
        className="main-content-header"
      >
        {/* Title & Subtitle */}
        <VStack spacing="xs" align="start" style={{ minWidth: 0, flex: '1 1 auto' }}>
          <H1>{title}</H1>
          {subtitle && (
            <Body size="lg" color="secondary">
              {subtitle}
            </Body>
          )}
        </VStack>
        
        {/* Actions */}
        {actions && (
          <HStack spacing="sm" align="center" style={{ flexShrink: 0 }}>
            {actions}
          </HStack>
        )}
      </HStack>
      
      {/* Additional Content */}
      {children && (
        <Box width="full">
          {children}
        </Box>
      )}
    </VStack>
  );
};

// ===============================================
// SECTION SUB-COMPONENT
// ===============================================

export interface MainContentSectionProps {
  /** Section content */
  children: ReactNode;
  
  /** Optional section title */
  title?: string;
  
  /** Optional section description */
  description?: string;
  
  /** Spacing below section */
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  /** Additional CSS class */
  className?: string;
}

export const MainContentSection: React.FC<MainContentSectionProps> = ({
  children,
  title,
  description,
  spacing = 'lg',
  className = '',
}) => {
  // Map spacing to VStack spacing values
  const spacingMap: Record<string, 'sm' | 'md' | 'lg' | 'xl' | '2xl'> = {
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    '2xl': '2xl',
  };

  return (
    <VStack 
      spacing={spacingMap[spacing]} 
      align="stretch" 
      className={className}
    >
      {/* Section Header */}
      {(title || description) && (
        <VStack spacing="xs" align="start">
          {title && <H2>{title}</H2>}
          {description && (
            <Body size="sm" color="secondary">
              {description}
            </Body>
          )}
        </VStack>
      )}
      
      {/* Section Content */}
      <Box width="full">
        {children}
      </Box>
    </VStack>
  );
};

// ===============================================
// EXPORTS
// ===============================================

export default MainContent;