// ===============================================
// src/design-system/components/patterns/page/PageHeader.tsx
// FIXED PAGE HEADER - Using VStack and HStack Properly
// ===============================================

import React, { ReactNode } from 'react';
import { cn } from '../../../utils/cn';

// Import Typography components
import { H1, Body, Display, H2, H3, H4, H5, H6 } from '../../../components/Typography';

// Import layout components
import { VStack } from '../../../components/layout';
import { HStack } from '../../../components/layout';

// Import Tag component
import { Tag } from '../../../components/feedback/Tag/Tag';
import type { TagVariant, TagSize } from '../../../components/feedback/Tag/Tag';

// ===== TYPE DEFINITIONS =====
export interface PageHeaderProps {
  children?: ReactNode;
  className?: string;
  
  // Content
  title: string;
  subtitle?: string;
  description?: string;
  actions?: ReactNode;
  
  // Layout
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  // Visual options
  background?: 'none' | 'subtle' | 'card';
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
}

// Re-export Tag component for convenience
export { Tag } from '../../../components/feedback/Tag/Tag';
export type { TagProps, TagVariant, TagSize } from '../../../components/feedback/Tag/Tag';

// ===== MAIN PAGE HEADER COMPONENT =====
export const PageHeader = React.forwardRef<HTMLElement, PageHeaderProps>(({
  children,
  className,
  title,
  subtitle,
  description,
  actions,
  align = 'left',
  size = 'lg',
  background = 'none',
  spacing = 'lg',
  ...props
}, ref) => {
  
  // Build CSS classes
  const classes = cn(
    'page-header',
    `page-header--align-${align}`,
    background !== 'none' && `page-header--bg-${background}`,
    `page-header--spacing-${spacing}`,
    className
  );

  // Map size to typography components
  const getTitleComponent = () => {
    switch (size) {
      case 'sm': return <H4 weight="bold">{title}</H4>;
      case 'md': return <H3 weight="bold">{title}</H3>;
      case 'lg': return <H2 weight="bold">{title}</H2>;
      case 'xl': return <Display size="sm" weight="bold">{title}</Display>;
      default: return <H2 weight="bold">{title}</H2>;
    }
  };

  const getSubtitleComponent = () => {
    if (!subtitle) return null;
    
    switch (size) {
      case 'sm': return <Body size="sm" color="secondary">{subtitle}</Body>;
      case 'md': return <Body size="md" color="secondary">{subtitle}</Body>;
      case 'lg': return <Body size="lg" color="secondary">{subtitle}</Body>;
      case 'xl': return <Body size="xl" color="secondary">{subtitle}</Body>;
      default: return <Body size="md" color="secondary">{subtitle}</Body>;
    }
  };

  const getDescriptionComponent = () => {
    if (!description) return null;
    
    switch (size) {
      case 'sm': return <Body size="xs" color="tertiary">{description}</Body>;
      case 'md': return <Body size="sm" color="tertiary">{description}</Body>;
      case 'lg': return <Body size="md" color="tertiary">{description}</Body>;
      case 'xl': return <Body size="lg" color="tertiary">{description}</Body>;
      default: return <Body size="sm" color="tertiary">{description}</Body>;
    }
  };

  return (
    <header ref={ref} className={classes} {...props}>
      <HStack spacing="lg" justify="between" align="start" wrap={false}>
        <VStack spacing="xs" className="page-header__text">
          {getTitleComponent()}
          {getSubtitleComponent()}
          {getDescriptionComponent()}
          
          {children}
        </VStack>
        
        {actions && (
          <div className="page-header__actions">
            {actions}
          </div>
        )}
      </HStack>
    </header>
  );
});

PageHeader.displayName = 'PageHeader';

// ===== SPECIALIZED PAGE HEADER COMPONENTS =====

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  stats?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const DashboardHeader = React.forwardRef<HTMLElement, DashboardHeaderProps>(({
  title,
  subtitle,
  stats,
  actions,
  className,
  ...props
}, ref) => {
  return (
    <PageHeader
      ref={ref}
      title={title}
      subtitle={subtitle}
      size="xl"
      align="left"
      actions={actions}
      className={cn('dashboard-header', className)}
      {...props}
    >
      {stats && (
        <div className="page-header__stats">
          {stats}
        </div>
      )}
    </PageHeader>
  );
});

DashboardHeader.displayName = 'DashboardHeader';

export interface SettingsHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const SettingsHeader = React.forwardRef<HTMLElement, SettingsHeaderProps>(({
  title,
  description,
  actions,
  className,
  ...props
}, ref) => {
  return (
    <PageHeader
      ref={ref}
      title={title}
      description={description}
      size="lg"
      align="left"
      background="subtle"
      actions={actions}
      className={cn('settings-header', className)}
      {...props}
    />
  );
});

SettingsHeader.displayName = 'SettingsHeader';

export interface ArticleHeaderProps {
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  className?: string;
}

export const ArticleHeader = React.forwardRef<HTMLElement, ArticleHeaderProps>(({
  title,
  subtitle,
  meta,
  className,
  ...props
}, ref) => {
  return (
    <PageHeader
      ref={ref}
      title={title}
      subtitle={subtitle}
      size="xl"
      align="center"
      spacing="xl"
      className={cn('article-header', className)}
      {...props}
    >
      {meta && (
        <div className="page-header__meta">
          {meta}
        </div>
      )}
    </PageHeader>
  );
});

ArticleHeader.displayName = 'ArticleHeader';