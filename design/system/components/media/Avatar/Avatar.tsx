// ===============================================
// design/system/components/media/Avatar/Avatar.tsx
// Avatar component using Image component internally
// ===============================================

import React, { forwardRef, ReactElement } from 'react';
import { cn } from '../../../utils/cn';
import { UserIcon } from '@heroicons/react/24/outline';
import { Image } from '../../media/Image';

// ===== TYPE DEFINITIONS =====
export type AvatarSize =
  | 'full'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';

export type AvatarVariant = 'solid' | 'subtle' | 'outline';
export type AvatarShape = 'square' | 'rounded' | 'full';
export type AvatarColorPalette =
  | 'gray'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'cyan'
  | 'purple'
  | 'pink';

export interface AvatarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  variant?: AvatarVariant;
  shape?: AvatarShape;
  colorPalette?: AvatarColorPalette;
  borderless?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// ===== SIZE MAP =====
const SIZE_MAP: Record<
  Exclude<AvatarSize, 'full'>,
  {
    width: number;
    height: number;
    fontSize: number;
  }
> = {
  '2xs': { width: 24, height: 24, fontSize: 10 },
  xs: { width: 32, height: 32, fontSize: 12 },
  sm: { width: 40, height: 40, fontSize: 14 },
  md: { width: 48, height: 48, fontSize: 16 },
  lg: { width: 56, height: 56, fontSize: 18 },
  xl: { width: 64, height: 64, fontSize: 20 },
  '2xl': { width: 80, height: 80, fontSize: 24 },
  '3xl': { width: 112, height: 112, fontSize: 32 },
  '4xl': { width: 140, height: 140, fontSize: 40 },
};

const RADIUS_MAP = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  full: 'var(--radius-full)',
};

// ===== AVATAR ROOT COMPONENT =====
export const AvatarRoot = forwardRef<HTMLDivElement, AvatarRootProps>(
  (
    {
      size = 'md',
      variant = 'subtle',
      shape = 'full',
      colorPalette = 'gray',
      borderless = false,
      className,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const isFullSize = size === 'full';
    const boxSize = !isFullSize ? SIZE_MAP[size] : undefined;

    const avatarClasses = cn(
      'avatar',
      `avatar-${variant}`,
      `avatar-${colorPalette}`,
      borderless && 'avatar-borderless',
      className
    );

    const borderRadius = shape === 'full' ? RADIUS_MAP.full : shape === 'rounded' ? RADIUS_MAP.md : RADIUS_MAP.sm;

    return (
      <div
        ref={ref}
        className={avatarClasses}
        role="img"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: isFullSize ? '100%' : `${boxSize?.width}px`,
          height: isFullSize ? '100%' : `${boxSize?.height}px`,
          minWidth: isFullSize ? undefined : `${boxSize?.width}px`,
          minHeight: isFullSize ? undefined : `${boxSize?.height}px`,
          fontSize: isFullSize ? undefined : `${boxSize?.fontSize}px`,
          borderRadius,
          overflow: 'hidden',
          position: 'relative',
          flexShrink: 0,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AvatarRoot.displayName = 'AvatarRoot';

// ===== AVATAR FALLBACK COMPONENT =====
export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  icon?: ReactElement;
  children?: React.ReactNode;
  className?: string;
}

export const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ name, icon, children, className, style, ...props }, ref) => {
    const getInitials = (n: string): string => {
      const parts = n.trim().split(' ').filter(Boolean);
      if (parts.length === 0) return '?';
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (
        parts[0].charAt(0).toUpperCase() +
        parts[parts.length - 1].charAt(0).toUpperCase()
      );
    };

    const label = name ? `Avatar for ${name}` : 'User avatar';

    const content = children ? (
      children
    ) : icon ? (
      icon
    ) : name ? (
      <span
        className="avatar-initials"
        style={{
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {getInitials(name)}
      </span>
    ) : (
      <UserIcon style={{ width: '60%', height: '60%' }} />
    );

    return (
      <div
        ref={ref}
        className={cn('avatar-fallback', className)}
        aria-label={label}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          ...style,
        }}
        {...props}
      >
        {content}
      </div>
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback';

// ===== AVATAR GROUP COMPONENT =====
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
  spacing?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max, size = 'md', spacing = 'md', children, className, style, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visible = max ? childArray.slice(0, max) : childArray;
    const remaining = max && childArray.length > max ? childArray.length - max : 0;

    return (
      <div
        ref={ref}
        className={cn('avatar-group', `avatar-group-${spacing}`, className)}
        role="group"
        style={{
          display: 'inline-flex',
          flexDirection: 'row-reverse',
          justifyContent: 'flex-end',
          alignItems: 'center',
          ...style,
        }}
        {...props}
      >
        {visible}
        {remaining > 0 && (
          <AvatarRoot size={size} variant="subtle" colorPalette="gray">
            <AvatarFallback>
              <span className="avatar-initials" style={{ lineHeight: 1 }}>
                +{remaining}
              </span>
            </AvatarFallback>
          </AvatarRoot>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

// ===== FALLBACK MODE TYPE =====
export type AvatarFallbackMode = 'icon' | 'initials' | 'none';

// ===== COMPOSITE AVATAR COMPONENT =====
export interface AvatarProps extends AvatarRootProps {
  name?: string;
  src?: string;
  alt?: string;
  loading?: 'eager' | 'lazy';
  icon?: ReactElement;
  fallback?: React.ReactNode;
  fallbackMode?: AvatarFallbackMode;
  backgroundColor?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(props, ref) {
  const {
    name,
    src,
    alt,
    loading = 'lazy',
    icon,
    fallback,
    fallbackMode,
    backgroundColor,
    children,
    size = 'md',
    variant = 'subtle',
    shape = 'full',
    colorPalette = 'gray',
    borderless = false,
    className,
    style,
    ...rest
  } = props;

  const isFullSize = size === 'full';
  const boxSize = !isFullSize ? SIZE_MAP[size] : undefined;

  const imageAlt = alt || (name ? `${name}'s avatar` : 'User avatar');

  const actualFallbackMode: AvatarFallbackMode = fallbackMode ?? (name ? 'initials' : 'icon');

  const bgColor = backgroundColor ?? (src ? 'var(--surface-page)' : undefined);

  const mergedStyle = {
    ...(bgColor ? { backgroundColor: bgColor } : {}),
    ...(style || {}),
  };

  return (
    <AvatarRoot
      ref={ref}
      size={size}
      variant={variant}
      shape={shape}
      colorPalette={colorPalette}
      borderless={borderless}
      className={className}
      style={Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined}
      {...rest}
    >
      {!src && actualFallbackMode !== 'none' && (
        <AvatarFallback
          name={actualFallbackMode === 'initials' ? name : undefined}
          icon={
            actualFallbackMode === 'icon'
              ? icon ?? <UserIcon style={{ width: '60%', height: '60%' }} />
              : undefined
          }
        >
          {fallback}
        </AvatarFallback>
      )}

      {src && (
        <Image
          className="avatar-image"
          src={src}
          alt={imageAlt}
          width={isFullSize ? '100%' : boxSize?.width}
          height={isFullSize ? '100%' : boxSize?.height}
          radius={shape === 'full' ? 'full' : shape === 'rounded' ? 'md' : 'sm'}
          objectFit="cover"
          loading={loading}
          priority={loading === 'eager'}
          showSkeleton={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 2,
          }}
        />
      )}

      {children}
    </AvatarRoot>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;

export const AvatarNamespace = Object.assign(Avatar, {
  Root: AvatarRoot,
  Fallback: AvatarFallback,
  Group: AvatarGroup,
});
