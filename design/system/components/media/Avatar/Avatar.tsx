// ===============================================
// design/system/components/media/Avatar/Avatar.tsx
// Avatar component for user profiles and initials
// ===============================================

import React, { forwardRef, ReactElement, useState } from 'react';
import { cn } from '../../../lib/utils';
import { UserIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../media/Icon';

// ===== TYPE DEFINITIONS =====
export type AvatarSize = 'full' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarVariant = 'solid' | 'subtle' | 'outline';
export type AvatarShape = 'square' | 'rounded' | 'full';
export type AvatarColorPalette = 
  | 'gray' | 'red' | 'orange' | 'yellow' | 'green' 
  | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';

export interface AvatarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  variant?: AvatarVariant;
  shape?: AvatarShape;
  colorPalette?: AvatarColorPalette;
  borderless?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  srcSet?: string;
  loading?: 'eager' | 'lazy';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  icon?: ReactElement;
  children?: React.ReactNode;
  className?: string;
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
  spacing?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

// ===== AVATAR ROOT COMPONENT =====
export const AvatarRoot = forwardRef<HTMLDivElement, AvatarRootProps>(
  ({ 
    size = 'md',
    variant = 'subtle',
    shape = 'full',
    colorPalette = 'gray',
    borderless = false,
    className,
    children,
    ...props 
  }, ref) => {
    const avatarClasses = cn(
      'avatar',
      `avatar-${size}`,
      `avatar-${variant}`,
      `avatar-${shape}`,
      `avatar-${colorPalette}`,
      borderless && 'avatar-borderless',
      className
    );

    return (
      <div 
        ref={ref} 
        className={avatarClasses}
        role="img"
        {...props}
      >
        {children}
      </div>
    );
  }
);

AvatarRoot.displayName = 'AvatarRoot';

// ===== AVATAR IMAGE COMPONENT =====
export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ src, srcSet, loading = 'lazy', className, alt = '', onError, ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setImageError(true);
      onError?.(e);
    };

    if (imageError || !src) {
      return null;
    }

    return (
      <img
        ref={ref}
        src={src}
        srcSet={srcSet}
        loading={loading}
        alt={alt}
        className={cn('avatar-image', className)}
        onError={handleError}
        {...props}
      />
    );
  }
);

AvatarImage.displayName = 'AvatarImage';

// ===== AVATAR FALLBACK COMPONENT =====
export const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ name, icon, children, className, ...props }, ref) => {
    // Generate initials from name
    const getInitials = (name: string): string => {
      const parts = name.trim().split(' ').filter(Boolean);
      if (parts.length === 0) return '?';
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const renderContent = () => {
      if (children) return children;
      if (icon) return icon;
      if (name) return <span className="avatar-initials">{getInitials(name)}</span>;
      return (
        <Icon size="md" color="muted">
          <UserIcon />
        </Icon>
      );
    };

    return (
      <div 
        ref={ref}
        className={cn('avatar-fallback', className)}
        {...props}
      >
        {renderContent()}
      </div>
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback';

// ===== AVATAR GROUP COMPONENT =====
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max, size = 'md', spacing = 'md', children, className, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visibleChildren = max ? childArray.slice(0, max) : childArray;
    const remainingCount = max && childArray.length > max ? childArray.length - max : 0;

    return (
      <div
        ref={ref}
        className={cn('avatar-group', `avatar-group-${spacing}`, className)}
        role="group"
        {...props}
      >
        {visibleChildren}
        {remainingCount > 0 && (
          <AvatarRoot size={size} variant="subtle" colorPalette="gray">
            <AvatarFallback>
              <span className="avatar-initials">+{remainingCount}</span>
            </AvatarFallback>
          </AvatarRoot>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

// ===== CLOSED COMPONENT COMPOSITION =====
type ImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

export interface AvatarProps extends AvatarRootProps {
  name?: string;
  src?: string;
  srcSet?: string;
  loading?: ImageProps['loading'];
  icon?: ReactElement;
  fallback?: React.ReactNode;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar(props, ref) {
    const { 
      name, 
      src, 
      srcSet, 
      loading, 
      icon, 
      fallback, 
      children,
      size = 'md',
      variant = 'subtle',
      shape = 'full',
      colorPalette = 'gray',
      borderless = false,
      className,
      ...rest 
    } = props;

    return (
      <AvatarRoot 
        ref={ref} 
        size={size}
        variant={variant}
        shape={shape}
        colorPalette={colorPalette}
        borderless={borderless}
        className={className}
        {...rest}
      >
        <AvatarFallback name={name}>
          {fallback || icon}
        </AvatarFallback>
        <AvatarImage src={src} srcSet={srcSet} loading={loading} />
        {children}
      </AvatarRoot>
    );
  }
);

Avatar.displayName = 'Avatar';

// ===== EXPORTS =====
export default Avatar;

// ===== NAMESPACE FOR COMPOSABLE API =====
export const AvatarNamespace = Object.assign(Avatar, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
  Group: AvatarGroup,
});