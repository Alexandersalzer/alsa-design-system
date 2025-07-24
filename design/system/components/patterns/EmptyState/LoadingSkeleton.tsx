import React from 'react';

export interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'default' | 'text' | 'circular' | 'rectangular';
  animated?: boolean;
  children?: never;
}

export function LoadingSkeleton({ 
  width = '100%', 
  height = '20px', 
  className = '',
  variant = 'default',
  animated = true 
}: LoadingSkeletonProps) {
  const skeletonClasses = [
    'loading-skeleton',
    variant !== 'default' && `loading-skeleton--${variant}`,
    !animated && 'loading-skeleton--static',
    className
  ].filter(Boolean).join(' ');

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  };

  return <div className={skeletonClasses} style={style} />;
}

// Card skeleton variations
export interface LoadingCardProps {
  variant?: 'basic' | 'detailed' | 'compact';
  showIcon?: boolean;
  showButton?: boolean;
  className?: string;
  animated?: boolean;
  delay?: number;
}

export function LoadingCard({ 
  variant = 'basic',
  showIcon = true,
  showButton = true,
  className = '',
  animated = true,
  delay = 0 
}: LoadingCardProps) {
  const cardClasses = [
    'loading-card',
    !animated && 'loading-card--static',
    className
  ].filter(Boolean).join(' ');

  const style = delay ? { animationDelay: `${delay}ms` } : undefined;

  return (
    <div className={cardClasses} style={style}>
      {/* Icon skeleton */}
      {showIcon && (
        <LoadingSkeleton 
          width="32px" 
          height="32px" 
          variant="rectangular"
          animated={animated}
          className="mb-xs"
        />
      )}

      {/* Title skeleton */}
      <LoadingSkeleton 
        width={variant === 'compact' ? '120px' : '160px'} 
        height="24px"
        animated={animated}
        className="mb-sm"
      />

      {/* Content skeletons */}
      {variant === 'detailed' ? (
        <>
          <LoadingSkeleton 
            width="100%" 
            height="16px"
            animated={animated}
            className="mb-xs"
          />
          <LoadingSkeleton 
            width="85%" 
            height="16px"
            animated={animated}
            className="mb-sm"
          />
          <LoadingSkeleton 
            width="70%" 
            height="16px"
            animated={animated}
            className="mb-md"
          />
        </>
      ) : variant === 'compact' ? (
        <LoadingSkeleton 
          width="100%" 
          height="14px"
          animated={animated}
          className="mb-md"
        />
      ) : (
        <>
          <LoadingSkeleton 
            width="100%" 
            height="16px"
            animated={animated}
            className="mb-xs"
          />
          <LoadingSkeleton 
            width="75%" 
            height="16px"
            animated={animated}
            className="mb-md"
          />
        </>
      )}

      {/* Button skeleton */}
      {showButton && (
        <LoadingSkeleton 
          width="140px" 
          height="40px"
          animated={animated}
          className="mt-auto"
        />
      )}
    </div>
  );
}

// List skeleton for navigation and other lists
export interface LoadingListProps {
  itemCount?: number;
  showIcons?: boolean;
  showBadges?: boolean;
  className?: string;
  animated?: boolean;
  itemDelay?: number;
}

export function LoadingList({ 
  itemCount = 5,
  showIcons = true,
  showBadges = false,
  className = '',
  animated = true,
  itemDelay = 100 
}: LoadingListProps) {
  return (
    <div className={`loading-list ${className}`}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div 
          key={index} 
          className="loading-list-item"
          style={animated ? { animationDelay: `${index * itemDelay}ms` } : undefined}
        >
          {showIcons && (
            <LoadingSkeleton 
              width="20px" 
              height="20px" 
              variant="rectangular"
              animated={animated}
            />
          )}
          <LoadingSkeleton 
            width={`${60 + Math.random() * 40}%`}
            height="16px"
            animated={animated}
            className="flex-1"
          />
          {showBadges && (
            <LoadingSkeleton 
              width="24px" 
              height="16px" 
              variant="circular"
              animated={animated}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Table skeleton
export interface LoadingTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
  animated?: boolean;
}

export function LoadingTable({ 
  rows = 5,
  columns = 4,
  showHeader = true,
  className = '',
  animated = true 
}: LoadingTableProps) {
  return (
    <div className={`loading-table ${className}`}>
      {showHeader && (
        <div className="loading-table-header">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <LoadingSkeleton 
              key={colIndex}
              width={`${50 + Math.random() * 30}%`}
              height="16px"
              animated={animated}
            />
          ))}
        </div>
      )}
      <div className="loading-table-body">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={rowIndex} 
            className="loading-table-row"
            style={animated ? { animationDelay: `${rowIndex * 50}ms` } : undefined}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <LoadingSkeleton 
                key={colIndex}
                width={`${40 + Math.random() * 40}%`}
                height="16px"
                animated={animated}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Text block skeleton with multiple lines
export interface LoadingTextProps {
  lines?: number;
  className?: string;
  animated?: boolean;
  lastLineWidth?: string;
}

export function LoadingText({ 
  lines = 3,
  className = '',
  animated = true,
  lastLineWidth = '70%' 
}: LoadingTextProps) {
  return (
    <div className={`loading-text ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <LoadingSkeleton 
          key={index}
          width={index === lines - 1 ? lastLineWidth : '100%'}
          height="16px"
          animated={animated}
          className="mb-xs"
        />
      ))}
    </div>
  );
}

// Avatar/Profile skeleton
export interface LoadingAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

export function LoadingAvatar({ 
  size = 'md',
  className = '',
  animated = true 
}: LoadingAvatarProps) {
  const sizeMap = {
    sm: '24px',
    md: '32px',
    lg: '48px',
    xl: '64px'
  };

  return (
    <LoadingSkeleton 
      width={sizeMap[size]}
      height={sizeMap[size]}
      variant="circular"
      animated={animated}
      className={className}
    />
  );
}

// Compose multiple loading components for complex layouts
export interface LoadingPageProps {
  variant?: 'dashboard' | 'list' | 'detail';
  className?: string;
  animated?: boolean;
}

export function LoadingPage({ 
  variant = 'dashboard',
  className = '',
  animated = true 
}: LoadingPageProps) {
  const pageClasses = [
    'loading-page',
    `loading-page--${variant}`,
    className
  ].filter(Boolean).join(' ');

  if (variant === 'dashboard') {
    return (
      <div className={pageClasses}>
        {/* Header */}
        <div className="loading-page-header">
          <LoadingSkeleton width="200px" height="32px" animated={animated} />
          <LoadingSkeleton width="300px" height="16px" animated={animated} />
        </div>

        {/* Tab Navigation */}
        <div className="loading-page-tabs">
          <LoadingSkeleton width="60px" height="32px" animated={animated} />
          <LoadingSkeleton width="80px" height="32px" animated={animated} />
          <LoadingSkeleton width="70px" height="32px" animated={animated} />
          <LoadingSkeleton width="90px" height="32px" animated={animated} />
        </div>

        {/* Cards Grid */}
        <div className="loading-page-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingCard 
              key={index}
              delay={index * 100}
              animated={animated}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={pageClasses}>
        <LoadingText lines={2} animated={animated} className="mb-lg" />
        <LoadingList 
          itemCount={8} 
          showIcons={true}
          animated={animated}
        />
      </div>
    );
  }

  // Detail variant
  return (
    <div className={pageClasses}>
      <LoadingSkeleton width="100%" height="200px" animated={animated} className="mb-lg" />
      <LoadingSkeleton width="300px" height="28px" animated={animated} className="mb-sm" />
      <LoadingText lines={4} animated={animated} />
    </div>
  );
}