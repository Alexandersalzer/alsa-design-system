// ===============================================
// src/design-system/components/patterns/page/PageContent.tsx
// FIXED PAGE CONTENT - Simplified to avoid React rendering issues
// ===============================================

import React, { ReactNode } from 'react';

// ===== TYPE DEFINITIONS =====

export interface PageContentProps {
  children: ReactNode;
  className?: string;
  
  // Padding options
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  paddingX?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  
  // Max width options (for centering content)
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  // Layout behavior
  centered?: boolean; // Center the content horizontally
  
  // Background options
  background?: 'page' | 'card' | 'none';
  
  // Scrolling behavior
  scrollable?: boolean;
}

// ===== SIMPLE CLASS CONCATENATION FUNCTION =====
// Using simple string concatenation instead of cn() to avoid issues
function buildClasses(...classNames: (string | undefined | false)[]): string {
  return classNames.filter(Boolean).join(' ');
}

// ===== MAIN PAGE CONTENT COMPONENT =====

export const PageContent = React.forwardRef<HTMLDivElement, PageContentProps>(({
  children,
  className,
  padding = 'md',
  paddingX,
  paddingY,
  maxWidth = 'none',
  centered = false,
  background = 'none',
  scrollable = true,
  ...props
}, ref) => {
  
  // Build CSS classes using simple string concatenation
  const classes = buildClasses(
    'page-content',
    
    // Padding classes
    padding !== 'none' && `page-content--padding-${padding}`,
    paddingX && `page-content--padding-x-${paddingX}`,
    paddingY && `page-content--padding-y-${paddingY}`,
    
    // Max width classes
    maxWidth !== 'none' && `page-content--max-width-${maxWidth}`,
    
    // Layout classes
    centered && 'page-content--centered',
    
    // Background classes
    background !== 'none' && `page-content--bg-${background}`,
    
    // Scrolling classes
    scrollable && 'page-content--scrollable',
    
    className
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

PageContent.displayName = 'PageContent';

// ===== SPECIALIZED PAGE CONTENT COMPONENTS =====

export interface PageSectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PageSection = React.forwardRef<HTMLDivElement, PageSectionProps>(({
  children,
  className,
  spacing = 'lg',
  ...props
}, ref) => {
  const classes = buildClasses(
    'page-section',
    `page-section--spacing-${spacing}`,
    className
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

PageSection.displayName = 'PageSection';

// ===== CONTENT CONTAINER FOR GRID LAYOUTS =====

export interface ContentContainerProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'narrow' | 'wide' | 'full';
}

export const ContentContainer = React.forwardRef<HTMLDivElement, ContentContainerProps>(({
  children,
  className,
  variant = 'default',
  ...props
}, ref) => {
  const classes = buildClasses(
    'content-container',
    `content-container--${variant}`,
    className
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

ContentContainer.displayName = 'ContentContainer';